import { Type } from "../Shared/Types";

export class Move {
    ID: string;

    Power: number;
    Energy: number;
    Turns: number | null;
    Type: Type;
    Category: MoveCategory

    constructor(id: string, power: number, energy: number, turns: number | null, type: Type) {
        this.ID = id;
        this.Power = power || 0;
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