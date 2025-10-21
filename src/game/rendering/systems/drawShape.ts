import { System, type Entity } from "../../../ecs";
import { getCtx } from "../canvas";
import { ShapeComp } from "../components";
import { PositionComp } from "../../logic";

export class DrawShape extends System {
    public executionOrder: number = 3;
    componentsRequired = new Set<Function>([ShapeComp, PositionComp]);
    update(entities: Set<Entity>): void {
        const ctx = getCtx();
        entities.forEach((entity) => {
            const shapeComp = this.ecs.getComponents(entity).get(ShapeComp);
            const position = this.ecs.getComponents(entity).get(PositionComp).val;
            ctx.fillStyle = shapeComp.color;

            const shape = shapeComp.shape;
            switch (shape.type) {
                case "square":
                    ctx.fillRect(position.x, position.y, shape.width, shape.height);
                    break;
                case "circle":
                    ctx.beginPath();
                    ctx.arc(position.x, position.y, shape.radius, 0, 2 * Math.PI);
                    ctx.fill();
            }
        });
    }
}
