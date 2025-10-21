import { System } from "../../../ecs";
import { SpriteComp } from "../components";

export class AnimationSystem extends System {
    public executionOrder: number = 1;
    public componentsRequired: Set<Function> = new Set([SpriteComp]);
    private timers: Map<string, number> = new Map();
    private lastTime: number | null = null;

    public update(entities: Set<string>): void {
        const now = Date.now();
        if (this.lastTime === null) this.lastTime = now;
        const dt = now - this.lastTime;
        this.lastTime = now;

        entities.forEach((entity) => {
            const sprite = this.ecs.getComponents(entity).get(SpriteComp);
            if (!sprite || !sprite.loaded) return;
            const frameCount = sprite.frameCount ?? 1;
            if (frameCount <= 1) return;

            const acc = (this.timers.get(entity) ?? 0) + dt;
            const frameMs = sprite.frameMs ?? 200;
            let newAcc = acc;
            while (newAcc >= frameMs) {
                sprite.animStep = (sprite.animStep + 1) % frameCount;
                newAcc -= frameMs;
            }
            this.timers.set(entity, newAcc);
        });
    }
}
