import { Component, ECS, System } from "./ecs.js"
import type { Entity } from "./ecs.js"

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;

function drawText(
    text: string,
    x: number,
    y: number,
    removeWidth: boolean = false,
    backgroundColor: string = "black",
    textColor: string = "white"
  ): number {
    ctx.textAlign = "left";
    ctx.font = "20px Consolas";
    ctx.fillStyle = backgroundColor;

    const metrics = ctx.measureText(text);
    const textWidth =
      metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft;

    let width = Math.round(textWidth) + 20;
    let height = 35;

    if (removeWidth) {
      x -= width;
    }

    ctx.fillRect(x - 10, y - 24, width, height);
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);

    return width;
  }

class Position extends Component {
    constructor(public x: number, public y: number) { super(); }
    toString(): string {
        return `Position(x=${this.x}, y=${this.y})`;
    }
}

class TextWithSquare extends Component {
    constructor(public text: string) { super(); }
}

class DrawText extends System {
    componentsRequired = new Set<Function>([TextWithSquare]);
    update(_entities: Set<Entity>): void { 
        _entities.forEach((entity) => {
            const text = this.ecs.getComponents(entity).get(TextWithSquare);
            drawText(text.text, 100, 100)
        })
     }
}

class Locator extends System {
    componentsRequired = new Set<Function>([Position]);
    update(_entities: Set<Entity>): void { 
        _entities.forEach((entity) => {
            console.log("system locator for entity : " + entity);
            const position = this.ecs.getComponents(entity).get(Position);
            console.log("pos: " + position.toString())
        })
     }
}

// Global ECS instance
const ecs = new ECS();



// variables for the game loop
let fps: number = 40;
let now: number;
let then: number = Date.now();
let interval: number = 1000 / fps;
let delta: number;

// The game loop
function animate(): void {
    requestAnimationFrame(animate);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        // update time
        then = now - (delta % interval);
        loop();
    }
}

function loop(): void {
    ecs.update();
}


export function startGame(){
    canvas =  document.getElementById("canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d")!

    ecs.addSystem(new Locator());
    ecs.addSystem(new DrawText());
    const player = ecs.addEntity();
    ecs.addComponent(player, new Position(3, 3))
    ecs.addComponent(player, new TextWithSquare("test"))
    animate();
}