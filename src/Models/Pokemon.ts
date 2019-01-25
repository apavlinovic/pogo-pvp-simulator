import Constants from "../Shared/Constants";
import { Move } from "./Move";
import { Type } from "../Shared/Types";
import { TypeEfficiency } from "../Shared/TypeEfficiency";

export class Pokemon {
    STA: number;
    ATK: number;
    DEF: number;
    LVL: number;
    HP: number;

    Type1: Type;
    Type2: Type | null;

    FastMove!: Move;
    ChargeMove!: Move;
    ChargeMove2!: Move;

    constructor(
        sta: number, atk: number, def: number, 
        type1: Type, type2: Type | null, 
        level: number, 
        staIV: number = 15, atkIV: number = 15, defIV: number = 15) {

        this.STA = sta + staIV;
        this.ATK = atk + atkIV;
        this.DEF = def + defIV;
        this.LVL = level;
        this.Type1 = type1;
        this.Type2 = type2 || null;
        
        this.HP = this.CalculateHP(sta, staIV, level);
    }

    CalculateHP(STA: number, IV: number, LVL: number) {
        return Constants.GetCPM(LVL) * (STA + IV);
    }

    CalculateDamageToTargetPokemon(target: Pokemon, move: Move) {
        let multi_type = TypeEfficiency.GetMoveEfficiency(move.Type, this.Type1, this.Type2);
        let multi_stab = this.GetStabMultiplier(move);
        let ratio_cpm = Constants.GetCPM(this.LVL) / Constants.GetCPM(target.LVL);
        let ratio_stats = this.ATK / target.DEF;

        let move_damage = 0.5 * (move.Power * ratio_stats * ratio_cpm) * (multi_type * multi_stab);

        return Math.floor(move_damage) + 1;
    }

    GetStabMultiplier(move: Move) {
        return (move.Type === this.Type1 || move.Type === this.Type2) ? Constants.STAB_MULTI : 1;
    }
}