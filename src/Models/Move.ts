import { Type } from "../Shared/Types";

export class Move {
    Power: number;
    Energy: number;
    Turns: number;
    Type: Type;

    constructor(power: number, energy: number, turns: number, type: Type) {
        this.Power = power;
        this.Energy = energy;
        this.Turns = turns;
        this.Type = type;
    }
}