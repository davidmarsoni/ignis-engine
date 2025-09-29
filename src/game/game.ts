import { ECS } from "../ecs";

import { setupRendering, ShapeComp, TextComp } from "./rendering";
import { PositionComp, setupMovement, Vec2, VelocityComp } from "./movement";

// Global ECS instance
const ecs = new ECS();

// setting game loop
const fps: number = 40;
const interval: number = 1000 / fps;

// variables for the game loop
let now: number;
let then: number = Date.now();
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


export function startGame() {
    setupRendering(ecs)
    setupMovement(ecs)

    const text = ecs.addEntity();
    ecs.addComponent(text, new PositionComp(new Vec2(100, 100)))
    ecs.addComponent(text, new TextComp("test", "white", "black"))

    const square = ecs.addEntity()
    ecs.addComponent(square, new PositionComp(new Vec2(300, 100)))
    ecs.addComponent(square, new ShapeComp({ type: "square", height: 50, width: 50 }, "red"))
    ecs.addComponent(square, new VelocityComp(new Vec2(1, 1)))

    const circleText = ecs.addEntity()
    ecs.addComponent(circleText, new PositionComp(new Vec2(500, 100)))
    ecs.addComponent(circleText, new ShapeComp({ type: "circle", radius: 30 }, "red"))
    ecs.addComponent(circleText, new TextComp("c", "white", "red"))

    animate();
}