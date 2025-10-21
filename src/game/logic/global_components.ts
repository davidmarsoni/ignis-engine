import { Component } from "../../ecs";
import { Vec2 } from "./math";

export class PositionComp extends Component {
    constructor(public val: Vec2) { super(); }
}

export class VelocityComp extends Component {
    constructor(public val: Vec2) { super(); }
}

export { PositionComp as Position, VelocityComp as Velocity };
