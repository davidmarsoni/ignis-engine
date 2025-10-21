let ctx: CanvasRenderingContext2D | null = null;
let canvas: HTMLCanvasElement | null = null;

export function initCanvas(id = 'canvas'): void {
    canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!canvas) throw new Error(`Canvas element with id '${id}' not found`);
    const c = canvas.getContext('2d');
    if (!c) throw new Error('2D context not supported');
    ctx = c;
    ctx.textAlign = 'left';
    ctx.font = '20px Consolas';
    ctx.fillStyle = 'black';
}

export function getCtx(): CanvasRenderingContext2D {
    if (!ctx) throw new Error('Canvas not initialized. Call initCanvas() first');
    return ctx;
}

export function getCanvas(): HTMLCanvasElement {
    if (!canvas) throw new Error('Canvas not initialized. Call initCanvas() first');
    return canvas;
}
