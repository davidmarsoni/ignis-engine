import { ECS } from "../../ecs";
import { Vec2 } from "../logic/math";
import { PositionComp } from "../logic/global_components";
import { SpriteComp } from "../rendering/components";

export function createCollectible(ecs: ECS, x = 0, y = 0, src = '/assets/sprites/Collectible.png') {
    const id = ecs.addEntity();
    ecs.addComponent(id, new PositionComp(new Vec2(x, y)));
    ecs.addComponent(id, new SpriteComp(src, 16, 16, 0, 0, 4, 200));
    return id;
}
