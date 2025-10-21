import { System, type Entity } from "../../../ecs";
import { getCtx } from "../canvas";
import { SpriteComp } from "../components";
import { PositionComp } from "../../logic";

export class DrawSprite extends System {
    public componentsRequired: Set<Function> = new Set([SpriteComp, PositionComp]);
    public executionOrder: number = 2;
    public update(entities: Set<Entity>): void {
        const ctx = getCtx();
        entities.forEach((entity) => {
            const sprite = this.ecs.getComponents(entity).get(SpriteComp);
            const position = this.ecs.getComponents(entity).get(PositionComp).val;

            if (!sprite || !sprite.loaded) return;

            const sx = sprite.spriteDirectionOffset;
            const sy = sprite.frameH * sprite.animStep;
            const sWidth = sprite.frameW;
            const sHeight = sprite.frameH;

            ctx.drawImage(
                sprite.image,
                sx,
                sy,
                sWidth,
                sHeight,
                position.x,
                position.y,
                sWidth,
                sHeight
            );
        });
    }
}
