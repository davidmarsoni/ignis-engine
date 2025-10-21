import { System, type Entity } from "../../../ecs";
import { getCtx } from "../canvas";
import { TextComp } from "../components";
import { PositionComp } from "../../logic";

export class DrawText extends System {
    public executionOrder: number = 4;
    componentsRequired = new Set<Function>([TextComp, PositionComp]);
    update(_entities: Set<Entity>): void {
        const ctx = getCtx();
        _entities.forEach((entity) => {
            const text = this.ecs.getComponents(entity).get(TextComp);
            const position = this.ecs.getComponents(entity).get(PositionComp).val;
            const metrics = ctx.measureText(text.content);
            const textWidth = metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft;

            let width = Math.round(textWidth) + 20;
            let height = 35;

            ctx.fillStyle = text.bgColor;
            ctx.fillRect(position.x - 10, position.y - 24, width, height);

            ctx.fillStyle = text.textColor;
            ctx.fillText(text.content, position.x, position.y);
        });
    }
}
