import Constants from "../Shared/Constants";
import { Battler } from "../Models/Battler";

export class SimulationResult {
    Winner: Battler;
    Looser: Battler;

    constructor(winner: Battler, looser: Battler) {
        this.Winner = winner;
        this.Looser = looser;
    }

    ToJSON() {
        return {
            Winner: this.Winner.Pokemon.ID,
            Winner_FM: this.Winner.FastMove.ID,
            Winner_CM: this.Winner.ChargeMove.ID,
            Winner_CM2: this.Winner.ChargeMove2 ? this.Winner.ChargeMove2.ID : null,
            Winner_Remaining_HP: this.WinnerRemainingHP(),
            Winner_Damage_Dealt: this.WinnerDamageDealt(),

            Looser: this.Looser.Pokemon.ID,
            Looser_FM: this.Looser.FastMove.ID,
            Looser_CM: this.Looser.ChargeMove.ID,
            Looser_CM2: this.Looser.ChargeMove2 ? this.Looser.ChargeMove2.ID : null,
            Looser_Damage_Dealt: this.LooserDamageDealt(),
            Looser_Remaining_HP: this.LooserRemainingHP(),

            Duration: this.CombatTime(),
            Overkill: this.Overkill()
        }
    }

    CombatTime() {
        return this.Winner.Turn * Constants.TURN_DURATION_MS;
    }

    Overkill() {
        return this.Looser.Health;
    }


    WinnerRemainingHP() {
        return this.Winner.Health / this.Winner.Pokemon.HP;
    }
    
    WinnerDamageDealt() {
        return this.Looser.Health <= 0 
        ? 1
        : (this.Looser.Pokemon.HP - this.Looser.Health) / this.Looser.Pokemon.HP;
    }

    WinnerEfficiency() {
        return this.WinnerDamageDealt() * this.WinnerRemainingHP();
    }


    LooserDamageDealt() {
        return 1 - this.WinnerRemainingHP();
    }

    LooserRemainingHP() {
        return this.Looser.Health > 0 
            ? this.Looser.Health / this.Looser.Pokemon.HP 
            : 0;
    }

    LooserEfficiency() {
        return this.LooserDamageDealt();
    }
}