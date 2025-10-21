import { Component } from "../../ecs";

export type Square = { type: 'square'; height: number; width: number };
export type Circle = { type: 'circle'; radius: number };
export type Shape = Square | Circle;

export class ShapeComp extends Component {
    constructor(public shape: Shape, public color: string) { super(); }
}

export class TextComp extends Component {
    constructor(public content: string, public textColor: string, public bgColor: string) { super(); }
}

export class SpriteComp extends Component {
    public image: HTMLImageElement;
    public loaded: boolean = false;
    public frameCount: number = 4;
    public frameMs: number = 200;

    constructor(
        public src: string,
        public frameW: number,
        public frameH: number,
        public animStep: number = 0,
        public spriteDirectionOffset: number = 0,
        frameCount?: number,
        frameMs?: number
    ) { super();
        this.image = new Image();
        this.image.src = src;
        this.image.onload = () => { this.loaded = true; };
        this.image.onerror = () => { this.loaded = false; console.warn(`Failed to load sprite: ${src}`); };
        if (typeof frameCount === 'number') this.frameCount = frameCount;
        if (typeof frameMs === 'number') this.frameMs = frameMs;
    }
}
