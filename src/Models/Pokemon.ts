import Constants from "../Shared/Constants";
import { Move } from "./Move";
import { Type } from "../Shared/Types";

export class Pokemon {
    ID: string;

    STA: number;
    ATK: number;
    DEF: number;
    LVL: number;
    HP: number;
    CP: number;
    
    Type1: Type;
    Type2: Type | null;

    FastMoves: Array<string>;
    ChargeMoves: Array<string>;

    constructor(
        id: string,
        sta: number, atk: number, def: number, 
        type1: Type, type2: Type | null, 
        level: number,
        fastMoves: Array<string> = new Array,
        chargeMoves: Array<string> = new Array,
        staIV: number = 0, atkIV: number = 0, defIV: number = 0) {

        this.ID = id;

        this.STA = sta + staIV;
        this.ATK = atk + atkIV;
        this.DEF = def + defIV;

        this.LVL = level;

        this.Type1 = type1;
        this.Type2 = type2 || null;
        
        this.HP = this.CalculateHP();
        this.CP = this.CalculateCP();

        this.FastMoves = fastMoves;
        this.ChargeMoves = chargeMoves;
    }

    ApplyIVs(staIV: number = 0, atkIV: number = 0, defIV: number = 0) {
        this.STA += staIV;
        this.ATK += atkIV;
        this.DEF += defIV;

        this.CP = this.CalculateCP();
        this.HP = this.CalculateHP();
    }

    ApplyLVL(level: number) {
        this.LVL = level

        this.CP = this.CalculateCP();
        this.HP = this.CalculateHP();
    }    

    CalculateHP() {
        return Constants.GetCPM(this.LVL) * (this.STA);
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