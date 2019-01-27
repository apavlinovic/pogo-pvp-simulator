import { Battler } from "../Models/Battler";
import Constants from "../Shared/Constants";

export class Simulator {
    Battler1: Battler;
    Battler2: Battler;

    constructor(pokemon1: Battler, pokemon2: Battler) {
        this.Battler1 = pokemon1;
        this.Battler2 = pokemon2;
    }

    Simulate() {
        do {

            this.SimulateTurn(this.Battler1, this.Battler2);
            this.SimulateTurn(this.Battler2, this.Battler1);

            this.Battler1.Tick();
            this.Battler2.Tick();
        } while(this.Battler1.IsAlive() && this.Battler2.IsAlive());

        return new SimulationResult(
            this.Battler1,
            this.Battler2
        );
    }

    private SimulateTurn(attacker: Battler, defender: Battler) {
        
        if(attacker.CanAct()) {
            if(attacker.CanUseChargeMove()) {
                attacker.DeclareAttack(attacker.ChargeMove);

                if(defender.CanUseShield()) {
                    defender.UseShield();
                    attacker.FoilAttack();
                } else {
                    attacker.ExecuteAttack(defender)
                }

            } else {
                attacker.DeclareAttack(attacker.FastMove);
                attacker.ExecuteAttack(defender);
            }
        }
    }
}

export class SimulationResult {
    Winner: Battler;
    Looser: Battler;

    constructor(participant1: Battler, participant2: Battler) {
        this.Winner = participant1.IsAlive() ? participant1 : participant2;
        this.Looser = participant1.IsAlive() ? participant2 : participant1;
    }

    CombatTime() {
        return this.Winner.Timeline.GetLastEvent().Turn * Constants.TURN_DURATION_MS;
    }

    Overkill() {
        return this.Looser.Health;
    }
}