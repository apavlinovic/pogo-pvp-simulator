import { Type } from "../Shared/Types";
import Constants from "../Shared/Constants";

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
        this.Category = energy > 0 ? MoveCategory.Fast : MoveCategory.Charge;
        this.Type = type;

        this.Turns = turns || (
            this.Category === MoveCategory.Fast 
            ? Constants.HALF_TURN_DURATION
            : Constants.CHARGE_MOVE_TURN_DURATION
        );
    }
}

export enum MoveCategory {
    Fast,
    Charge
}