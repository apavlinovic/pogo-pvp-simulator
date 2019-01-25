import Constants from "../Shared/Constants";
import { Move } from "./Move";
import { Type } from "../Shared/Types";

export class Pokemon {
    STA: number;
    ATK: number;
    DEF: number;
    LVL: number;
    HP: number;
    CP: number;
    
    Type1: Type;
    Type2: Type | null;


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
        this.CP = this.CalculateCP();
    }

    CalculateHP(STA: number, IV: number, LVL: number) {
        return Constants.GetCPM(LVL) * (STA + IV);
    }

    CalculateCP() {
        return Math.floor(
            (
                this.ATK 
                * Math.pow(this.DEF, 0.5) 
                * Math.pow(this.STA, 0.5) 
                * Math.pow(Constants.GetCPM(this.LVL), 2)
            ) 
        / 10);
    }    

    GetStabMultiplier(move: Move) {
        return (move.Type === this.Type1 || move.Type === this.Type2) ? Constants.STAB_MULTI : 1;
    }
}