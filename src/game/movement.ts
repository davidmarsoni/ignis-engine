import { Component, ECS, System, type Entity } from "../ecs";

export function setupMovement(ecs: ECS) {
    ecs.addSystem(new VelocitySystem())
}

export class Vec2 {
    constructor(public x: number, public y: number) { }
    public set(other: Vec2): void {
        this.x = other.x;
        this.y = other.y;
    }
    public toString(): string {
        return `Vec2(${this.x}, ${this.y})`;
    }
    public add(other: Vec2): Vec2 {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
}

export class PositionComp extends Component {
    constructor(public val: Vec2) { super(); }
}

export class VelocityComp extends Component {
    constructor(public val: Vec2) { super(); }
}

export default class VelocitySystem extends System {
    public executionOrder: number = 1;
    componentsRequired = new Set<Function>([VelocityComp, PositionComp]);
    public update(entities: Set<Entity>): void {
        entities.forEach((entity) => {
            const components = this.ecs.getComponents(entity);
            const vel = components.get(VelocityComp).val;
            let pos = components.get(PositionComp).val;
            console.log("pos " + pos.toString())
            pos.set(pos.add(vel));
        })
    }
}