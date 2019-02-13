import Constants from "../Shared/Constants";
import { Move } from "./Move";
import { Type } from "../Shared/Types";
import _ = require("lodash");

export class Pokemon {
    ID: string;
    
    STA: number;
    ATK: number;
    DEF: number;
    
    IV_STA: number;
    IV_ATK: number;
    IV_DEF: number;
    
    
    LVL: number;
    HP: number;
    CP: number;
    
    Type1: Type;
    Type2: Type | null;
    
    FastMoves: Array<string>;
    ChargeMoves: Array<string>;
    
    constructor(id: string,
        sta: number, atk: number, def: number, 
        type1: Type, type2: Type | null, 
        level: number,
        fastMoves: Array<string> = new Array,
        chargeMoves: Array<string> = new Array,
        staIV: number = 0, atkIV: number = 0, defIV: number = 0) {
            
            this.ID = id;
            
            this.STA = sta;
            this.ATK = atk;
            this.DEF = def;
            
            this.IV_STA = staIV;
            this.IV_ATK = staIV;
            this.IV_DEF = staIV;
            
            this.LVL = level;
            
            this.Type1 = type1;
            this.Type2 = type2 || null;
            
            this.HP = this.CalculateHP();
            this.CP = this.CalculateCP();
            
            this.FastMoves = fastMoves;
            this.ChargeMoves = chargeMoves;
        }
        
        ApplyIVs(staIV: number = 0, atkIV: number = 0, defIV: number = 0) {
            this.IV_STA = staIV;
            this.IV_ATK = staIV;
            this.IV_DEF = staIV;
            
            this.CP = this.CalculateCP();
            this.HP = this.CalculateHP();
        }
        
        ApplyLVL(level: number) {
            this.LVL = level
            
            this.CP = this.CalculateCP();
            this.HP = this.CalculateHP();
        }    
        
        ScaleToCombatPower(targetCP: number) {
            let results = new Array<{ atkIv: number, staIv: number, defIv: number, level: number, cp: number}>();
            
            for(var level = 1; level <= 40; level += 0.5) {
                for(var iv = 0; iv <= 15; iv++) {
                    results.push({
                        atkIv: iv,
                        staIv: iv,
                        defIv: iv,
                        level,
                        cp: this.Formula_CP(this.ATK + iv, this.DEF + iv, this.STA  + iv, Constants.GetCPM(level))
                    });
                };
            };
            
            let scale = _(results).filter(res => res.cp <= targetCP).orderBy(res => { return res.cp + res.atkIv + res.staIv + res.defIv }, 'desc').first();
            
            if(scale) {
                this.ApplyIVs(scale.staIv, scale.atkIv, scale.defIv);
                this.ApplyLVL(scale.level);
            }
        }
        
        CalculateHP() {
            return Constants.GetCPM(this.LVL) * (this.STA + this.IV_STA);
        }
        
        CalculateCP() {
            return this.Formula_CP(this.ATK + this.IV_ATK, this.DEF + this.IV_DEF, this.STA  + this.IV_STA, Constants.GetCPM(this.LVL));
        }    
        
        private Formula_CP(ATK: number, DEF: number, STA: number, CPM: number) {
            return Math.floor((ATK * Math.pow(DEF, 0.5) * Math.pow(STA, 0.5) * Math.pow(CPM, 2)) / 10);
        }
                
    }