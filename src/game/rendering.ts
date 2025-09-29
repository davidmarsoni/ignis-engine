import { Component, ECS, System, type Entity } from "../ecs";
import { PositionComp } from "./movement";

var ctx: CanvasRenderingContext2D;
var canvas: HTMLCanvasElement;

export function setupRendering(ecs: ECS) {
    setupCanvas()
    ecs.addSystem(new AnimationSystem());
    ecs.addSystem(new DrawSprite());
    ecs.addSystem(new DrawShape());
    ecs.addSystem(new DrawText());
    ecs.addSystem(new ClearCanvas())
}

function setupCanvas() {
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d")!
    ctx.textAlign = "left";
    ctx.font = "20px Consolas";
    ctx.fillStyle = "black";
}

export type Square = {
    type: "square"
    height: number,
    width: number
}

export type Circle = {
    type: "circle"
    radius: number
}

export type Shape = Square | Circle

export class ShapeComp extends Component {
    constructor(public shape: Shape, public color: string) { super(); }
}

export class DrawShape extends System {
    public executionOrder: number = 3;
    componentsRequired = new Set<Function>([ShapeComp, PositionComp]);
    update(entities: Set<Entity>): void {
        entities.forEach((entity) => {
            const shapeComp = this.ecs.getComponents(entity).get(ShapeComp);
            const position = this.ecs.getComponents(entity).get(PositionComp).val;
            ctx.fillStyle = shapeComp.color

            const shape = shapeComp.shape
            switch (shape.type) {
                case "square":
                    ctx.fillRect(position.x, position.y, shape.width, shape.height)
                    break;
                case "circle":
                    ctx.beginPath();
                    ctx.arc(position.x, position.y, shape.radius, 0, 2 * Math.PI);
                    ctx.fill();
            }
        })
    }
}

export class TextComp extends Component {
    constructor(public content: string, public textColor: string, public bgColor: string) { super(); }
}

class DrawText extends System {
    public executionOrder: number = 4;
    componentsRequired = new Set<Function>([TextComp, PositionComp]);
    update(_entities: Set<Entity>): void {
        _entities.forEach((entity) => {
            const text = this.ecs.getComponents(entity).get(TextComp);
            const position = this.ecs.getComponents(entity).get(PositionComp).val;
            const metrics = ctx.measureText(text.content);
            const textWidth =
                metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft;

            let width = Math.round(textWidth) + 20;
            let height = 35;

            ctx.fillStyle = text.bgColor;
            ctx.fillRect(position.x - 10, position.y - 24, width, height);

            ctx.fillStyle = text.textColor;
            ctx.fillText(text.content, position.x, position.y);
        })
    }
}

class DrawSprite extends System {
    public componentsRequired: Set<Function> = new Set([SpriteComp, PositionComp]);
    public executionOrder: number = 2;
    public update(entities: Set<Entity>): void {
        entities.forEach((entity) => {
            const sprite = this.ecs.getComponents(entity).get(SpriteComp);
            const position = this.ecs.getComponents(entity).get(PositionComp).val;

            if (!sprite || !sprite.loaded) return;

            // source x = direction offset (in pixels)
            const sx = sprite.spriteDirectionOffset;
            // source y = frame height * animStep (row index)
            const sy = sprite.frameH * sprite.animStep;
            const sWidth = sprite.frameW;
            const sHeight = sprite.frameH;

            // draw at entity position (top-left). Adjust as needed for centering.
            ctx.drawImage(
                sprite.image,
                sx,
                sy,
                sWidth,
                sHeight,
                position.x,
                position.y,
                sWidth,
                sHeight
            );
        })
    }
}

export class SpriteComp extends Component {
    public image: HTMLImageElement;
    public loaded: boolean = false;
    /** How many frames are in this animation (columns or rows depending on layout) */
    public frameCount: number = 4;
    /** Milliseconds per frame */
    public frameMs: number = 200;
    /**
     * @param src - path to the spritesheet image
     * @param frameW - width of a single frame in the sheet
     * @param frameH - height of a single frame in the sheet
     * @param animStep - which frame (row index) to use
     * @param spriteDirectionOffset - x offset into the sheet for direction (in pixels)
     */
    constructor(
        public src: string,
        public frameW: number,
        public frameH: number,
        public animStep: number = 0,
        public spriteDirectionOffset: number = 0,
        frameCount?: number,
        frameMs?: number
    ) { super();
        this.image = new Image();
        this.image.src = src;
        this.image.onload = () => { this.loaded = true; };
        this.image.onerror = () => { this.loaded = false; console.warn(`Failed to load sprite: ${src}`); };
        if (typeof frameCount === 'number') this.frameCount = frameCount;
        if (typeof frameMs === 'number') this.frameMs = frameMs;
    }
}

class AnimationSystem extends System {
    public executionOrder: number = 1;
    public componentsRequired: Set<Function> = new Set([SpriteComp]);
    private timers: Map<Entity, number> = new Map();
    private lastTime: number | null = null;

    public update(entities: Set<Entity>): void {
        const now = Date.now();
        if (this.lastTime === null) this.lastTime = now;
        const dt = now - this.lastTime;
        this.lastTime = now;

        entities.forEach((entity) => {
            const sprite = this.ecs.getComponents(entity).get(SpriteComp);
            if (!sprite || !sprite.loaded) return;
            const frameCount = sprite.frameCount ?? 1;
            if (frameCount <= 1) return;

            const acc = (this.timers.get(entity) ?? 0) + dt;
            const frameMs = sprite.frameMs ?? 200;
            let newAcc = acc;
            while (newAcc >= frameMs) {
                sprite.animStep = (sprite.animStep + 1) % frameCount;
                newAcc -= frameMs;
            }
            this.timers.set(entity, newAcc);
        });
    }
}

class ClearCanvas extends System {
    public componentsRequired: Set<Function> = new Set();
    public executionOrder: number = 0;
    public update(_: Set<Entity>): void {
        console.log("clear canvas")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}