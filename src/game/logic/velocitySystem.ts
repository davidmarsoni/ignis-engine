import { System, type Entity, ECS } from "../../ecs";
import { VelocityComp, PositionComp } from "./global_components";
import { Vec2 } from "./math";

export class VelocitySystem extends System {
    public executionOrder: number = 1;
    componentsRequired = new Set<Function>([VelocityComp, PositionComp]);
    public update(entities: Set<Entity>): void {
        entities.forEach((entity) => {
            const components = this.ecs.getComponents(entity);
            const vel = components.get(VelocityComp).val as Vec2;
            const pos = components.get(PositionComp).val as Vec2;
            pos.set(pos.add(vel));
        });
    }
}

export function setupMovement(ecs: ECS) {
    ecs.addSystem(new VelocitySystem());
}
