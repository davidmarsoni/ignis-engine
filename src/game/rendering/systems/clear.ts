import { System } from "../../../ecs";
import { getCtx, getCanvas } from "../canvas";

export class ClearCanvas extends System {
    public componentsRequired: Set<Function> = new Set();
    public executionOrder: number = 0;
    public update(_: Set<string>): void {
        const ctx = getCtx();
        const canvas = getCanvas();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
