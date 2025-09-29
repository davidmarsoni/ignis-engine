import { ECS } from "../ecs";

import { PositionComp, setupRendering, TextComp } from "./rendering";

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
    animate();
}