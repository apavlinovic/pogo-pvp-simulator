import { Type } from "../Shared/Types";

export class Move {
    Power: number;
    Energy: number;
    Turns: number | null;
    Type: Type;
    Category: MoveCategory

    constructor(power: number, energy: number, turns: number | null, type: Type) {
        this.Power = power;
        this.Energy = energy;
        this.Turns = turns;
        this.Type = type;
        this.Category = energy > 0 ? MoveCategory.Fast : MoveCategory.Charge;
    }
}

export enum MoveCategory {
    Fast,
    Charge
}