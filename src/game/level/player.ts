import { ECS } from "../../ecs";
import { Vec2 } from "../logic/math";
import { PositionComp, VelocityComp } from "../logic/global_components";
import { SpriteComp } from "../rendering/components";

export function createPlayer(ecs: ECS, x = 0, y = 0) {
    const id = ecs.addEntity();
    ecs.addComponent(id, new PositionComp(new Vec2(x, y)));
    ecs.addComponent(id, new VelocityComp(new Vec2(0, 0)));
    ecs.addComponent(id, new SpriteComp('/assets/sprites/Player.png', 16, 16));

    // Additional 

    return id;
}
