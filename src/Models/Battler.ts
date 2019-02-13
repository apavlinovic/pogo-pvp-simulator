import { Pokemon } from "./Pokemon";
import { Move, MoveCategory } from "./Move";
import { TypeEfficiency } from "../Shared/TypeEfficiency";
import Constants from "../Shared/Constants";
import { Timeline, TimelineEvent, TimelineEventType } from "../Simulator/Timeline";
import Formulas from "../Shared/Formulas";

export class Battler {
    Pokemon: Pokemon;
    FastMove: Move;
    ChargeMove: Move;
    ChargeMove2: Move | null;

    Energy: number;
    Shields: number;
    Health: number;

    Turn: number;
    private Cooldown: number;
    private NextDeclaredMove: Move | null;

    Timeline!: Timeline | null;

    constructor(pokemon: Pokemon, fastMove: Move, chargeMove: Move, chargeMove2?: Move | null, shields : number = Constants.SHIELD_COUNT, enableTimeline: boolean = false) {
        this.Pokemon = pokemon;

        this.FastMove = fastMove;
        this.ChargeMove = chargeMove;
        this.ChargeMove2 = chargeMove2 ? chargeMove2 : null;

        if(enableTimeline) {
            this.Timeline = new Timeline();
        }

        this.Health = this.Pokemon.HP;
        
        this.Turn = 0;        
        this.Cooldown = 0;
        this.NextDeclaredMove = null;

        this.Energy = 0;
        this.Shields = shields;
    }

    Tick() {
        this.Cooldown -= Constants.SIM_TURN_DELTA;
        this.Turn += Constants.SIM_TURN_DELTA;

        if(this.Cooldown < 0) {
            this.Cooldown = 0;
        };

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
        this.Cooldown = 0;
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
        return this.Energy + this.ChargeMove.Energy >= 0;
    }

    CanAct() {
        return this.Cooldown === 0;
    }

    CanUseFastMoveBeforeTargetCanAct(target: Battler) {
        if(this.FastMove.Turns) {
            if(this.FastMove.Turns === Constants.HALF_TURN_DURATION) {
                return false;
            }

            return target.Cooldown > this.FastMove.Turns;
        }

        return false;
    }

    CanKillTarget(target: Battler, move: Move) {

        return target.Health <= Formulas.CalculateDamageToTargetPokemon(this.Pokemon, target.Pokemon, move);
    }


    UseShield() {
        this.Shields--;
        this.NextDeclaredMove = null;

        if(this.Timeline) {
            this.Timeline.AddEvent(new TimelineEvent(this.Turn, Constants.CHARGE_MOVE_TURN_DURATION, TimelineEventType.Shield))
        }
    }

    ApplyShieldCooldown() {
        this.Cooldown = Constants.SHIELD_TURN_DURATION;
    }

    DeclareAttack(move: Move) {
        this.Energy += move.Energy;
        this.NextDeclaredMove = move;

        if(move.Category == MoveCategory.Fast) {
            this.Cooldown = move.Turns as number;
        } else {
            this.Cooldown = Constants.CHARGE_MOVE_TURN_DURATION + Constants.HALF_TURN_DURATION;
        }

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
            let damage = Formulas.CalculateDamageToTargetPokemon(this.Pokemon, target.Pokemon, this.NextDeclaredMove);
            target.Health -= damage;

            return damage;
        }

        return 0;
    }
}