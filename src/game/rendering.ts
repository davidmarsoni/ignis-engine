import { Component, ECS, System, type Entity } from "../ecs";

var ctx: CanvasRenderingContext2D;

export const DEFAULT_TEXT_COLOR = "white"

export function setupRendering(ecs: ECS) {
    setupCanvas()
    ecs.addSystem(new DrawText());
}

function setupCanvas() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d")!
    ctx.textAlign = "left";
    ctx.font = "20px Consolas";
    ctx.fillStyle = "black";
}

export class TextComponent extends Component {
    constructor(public content: string, public textColor: string, public bgColor: string) { super(); }
}

export class Position extends Component {
    constructor(public x: number, public y: number) { super(); }
}

class DrawText extends System {
    componentsRequired = new Set<Function>([TextComponent, Position]);
    update(_entities: Set<Entity>): void {
        _entities.forEach((entity) => {
            const text = this.ecs.getComponents(entity).get(TextComponent);
            const position = this.ecs.getComponents(entity).get(Position);
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