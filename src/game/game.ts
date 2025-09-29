import { ECS } from "../ecs";

import { setupRendering, ShapeComp, TextComp } from "./rendering";
import { SpriteComp } from "./rendering";
import { PositionComp, setupMovement, Vec2, VelocityComp } from "./movement";

// Global ECS instance
const ecs = new ECS();

// setting game loop
const fps: number = 48;
const interval: number = 1000 / fps;

// variables for the game loop
let now: number;
let then: number = Date.now();
let delta: number;
let rafId: number | null = null;

// The game loop
function animate(): void {
    rafId = requestAnimationFrame(animate);

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

    // collectible sprite: use the first frame (top-left) of the Collectible spritesheet
    const collectible = ecs.addEntity();
    ecs.addComponent(collectible, new PositionComp(new Vec2(200, 200)));
    ecs.addComponent(collectible, new SpriteComp('/assets/sprites/Collectible.png',16, 16, 32, 0, 4, 200));

    const collectible2 = ecs.addEntity();
    ecs.addComponent(collectible2, new PositionComp(new Vec2(220, 220)));
    ecs.addComponent(collectible2, new SpriteComp('/assets/sprites/Collectible.png',16, 16, 0, 16, 4, 200));

    animate();
}

export function stopGame(): void {
    // cancel the animation frame if running
    if (typeof rafId === 'number') {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    // reset ECS state so next start is clean
    ecs.reset();
}