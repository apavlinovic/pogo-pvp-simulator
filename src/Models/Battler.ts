import { Pokemon } from "./Pokemon";
import { Move, MoveCategory } from "./Move";
import { TypeEfficiency } from "../Shared/TypeEfficiency";
import Constants from "../Shared/Constants";
import { Timeline, TimelineEvent, TimelineEventType } from "../Simulator/Timeline";

export class Battler {
    Pokemon: Pokemon;
    FastMove: Move;
    ChargeMove: Move;
    ChargeMove2: Move | null;

    Energy: number;
    Shields: number;
    Health: number;

    Turn: number;
    private NextActionableTurn: number;
    private NextDeclaredMove: Move | null;

    Timeline!: Timeline | null;

    constructor(pokemon: Pokemon, fastMove: Move, chargeMove: Move, chargeMove2?: Move | null, shields : number = 2, enableTimeline: boolean = false) {
        this.Pokemon = pokemon;

        this.FastMove = fastMove;
        this.ChargeMove = chargeMove;
        this.ChargeMove2 = chargeMove2 ? chargeMove2 : null;

        if(enableTimeline) {
            this.Timeline = new Timeline();
        }

        this.Health = this.Pokemon.HP;
        
        this.Turn = 0;        
        this.NextActionableTurn = 0;
        this.NextDeclaredMove = null;

        this.Energy = 0;
        this.Shields = shields || Constants.SHIELD_COUNT;
    }

    Tick() {
        this.Turn++;
    }

    ScaleTo(combatPower: number) {
        this.Pokemon.ScaleToCombatPower(combatPower);
        this.Reset();
    }

    Reset() {
                
        this.Health = this.Pokemon.HP;
        
        if(this.Timeline) {
            this.Timeline = new Timeline();
        }

        this.Turn = 0;        
        this.NextActionableTurn = 0;
        this.NextDeclaredMove = null;

        this.Energy = 0;
        this.Shields = Constants.SHIELD_COUNT;
    }

    IsAlive() {
        return this.Health >= 0;
    }

    CanUseShield() {
        return this.Shields > 0;
    }

    CanUseChargeMove() {
        return this.Energy + this.ChargeMove.Energy > 0;
    }

    CanAct() {
        return this.Turn == 0 || this.Turn >= this.NextActionableTurn;
    }



    UseShield() {
        this.Shields--;
        this.NextActionableTurn = this.Turn + Constants.SHIELD_TURN_DURATION;
        this.NextDeclaredMove = null;

        if(this.Timeline) {
            this.Timeline.AddEvent(new TimelineEvent(this.Turn, Constants.CHARGE_MOVE_TURN_DURATION, TimelineEventType.Shield))
        }
    }

    DeclareAttack(move: Move) {
        this.Energy += move.Energy;
        this.NextDeclaredMove = move;
        
        if(this.Energy > 100) {
            this.Energy = 100;
        } else if (this.Energy < 0) {
            this.Energy = 0;
        }

        this.NextActionableTurn = this.Turn + (move.Turns || Constants.CHARGE_MOVE_TURN_DURATION);

        if(this.Timeline) {
            if(move.Category == MoveCategory.Fast) {
                this.Timeline.AddEvent(new TimelineEvent(this.Turn, (move.Turns as number), TimelineEventType.FastMove));
            } else if(move.Category == MoveCategory.Charge) {
                this.Timeline.AddEvent(new TimelineEvent(this.Turn,  Constants.CHARGE_MOVE_TURN_DURATION, TimelineEventType.ChargeMove));
            }
        }
    }

    FoilAttack() {
        this.NextDeclaredMove = null;
    }

    ExecuteAttack(target: Battler) {
        if(this.NextDeclaredMove) {
            let damage = this.CalculateDamageToTargetPokemon(target.Pokemon, this.NextDeclaredMove);
            target.Health -= damage;

            return damage;
        }

        return 0;
    }

    private CalculateDamageToTargetPokemon(target: Pokemon, move: Move) {
        let multi_type = TypeEfficiency.GetMoveEfficiency(move.Type, target.Type1, target.Type2);
        let multi_stab = this.Pokemon.GetStabMultiplier(move);

        let ratio_cpm = Constants.GetCPM(this.Pokemon.LVL) / Constants.GetCPM(target.LVL);
        let ratio_stats = (this.Pokemon.ATK + this.Pokemon.IV_ATK) / (target.DEF + target.IV_DEF);

        let move_damage = 0.5 * (move.Power * ratio_stats * ratio_cpm) * (multi_type * multi_stab);

        return Math.floor(move_damage) + 1;
    }

}