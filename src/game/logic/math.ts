/**
 * Lightweight 2D vector utilities used across movement and physics.
 */
export class Vec2 {
    constructor(public x: number = 0, public y: number = 0) {}
    set(other: Vec2): void { this.x = other.x; this.y = other.y; }
    add(other: Vec2): Vec2 { return new Vec2(this.x + other.x, this.y + other.y); }
    copy(): Vec2 { return new Vec2(this.x, this.y); }
    toString(): string { return `Vec2(${this.x}, ${this.y})`; }
}
