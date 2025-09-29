import { Component, ECS, System, type Entity } from "../ecs";

var ctx: CanvasRenderingContext2D;

export const DEFAULT_TEXT_COLOR = "white"

export function setupRendering(ecs: ECS) {
    setupCanvas()
    ecs.addSystem(new DrawShape());
    ecs.addSystem(new DrawText());

    const text = ecs.addEntity();
    ecs.addComponent(text, new PositionComp(100, 100))
    ecs.addComponent(text, new TextComp("test", "white", "black"))

    const square = ecs.addEntity()
    ecs.addComponent(square, new PositionComp(300, 100))
    ecs.addComponent(square, new ShapeComp({ type: "square", height: 50, width: 50 }, "red"))

    const circleText = ecs.addEntity()
    ecs.addComponent(circleText, new PositionComp(500, 100))
    ecs.addComponent(circleText, new ShapeComp({ type: "circle", radius: 30 }, "red"))
    ecs.addComponent(circleText, new TextComp("c", "white", "red"))
}

function setupCanvas() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d")!
    ctx.textAlign = "left";
    ctx.font = "20px Consolas";
    ctx.fillStyle = "black";
}

export class PositionComp extends Component {
    constructor(public x: number, public y: number) { super(); }
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
    componentsRequired = new Set<Function>([ShapeComp, PositionComp]);
    update(_entities: Set<Entity>): void {
        _entities.forEach((entity) => {
            const shapeComp = this.ecs.getComponents(entity).get(ShapeComp);
            const position = this.ecs.getComponents(entity).get(PositionComp);
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
    componentsRequired = new Set<Function>([TextComp, PositionComp]);
    update(_entities: Set<Entity>): void {
        _entities.forEach((entity) => {
            const text = this.ecs.getComponents(entity).get(TextComp);
            const position = this.ecs.getComponents(entity).get(PositionComp);
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