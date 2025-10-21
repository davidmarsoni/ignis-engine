import { ECS } from "../../ecs";
import { initCanvas } from "./canvas";
import { ClearCanvas } from "./systems/clear";
import { AnimationSystem } from "./systems/animation";
import { DrawSprite } from "./systems/drawSprite";
import { DrawShape } from "./systems/drawShape";
import { DrawText } from "./systems/drawText";

export function setupRendering(ecs: ECS, canvasId = 'canvas') {
    initCanvas(canvasId);
    ecs.addSystem(new ClearCanvas());
    ecs.addSystem(new AnimationSystem());
    ecs.addSystem(new DrawSprite());
    ecs.addSystem(new DrawShape());
    ecs.addSystem(new DrawText());
}
