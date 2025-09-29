import { Component, ECS, System, type Entity } from "../ecs";
import { PositionComp } from "./movement";

var ctx: CanvasRenderingContext2D;
var canvas: HTMLCanvasElement;

export function setupRendering(ecs: ECS) {
    setupCanvas()
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
    public executionOrder: number = 2;
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
    public executionOrder: number = 3;
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

class ClearCanvas extends System {
    public componentsRequired: Set<Function> = new Set();
    public executionOrder: number = 0;
    public update(_: Set<Entity>): void {
        console.log("clear canvas")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}