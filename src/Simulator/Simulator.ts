import { Battler } from "../Models/Battler";
import { SimulationResult } from "./SimulationResult";

export class Simulator {
    Battler1!: Battler;
    Battler2!: Battler;

    constructor() {
    }

    SetBattlers(pokemon1: Battler, pokemon2: Battler) {
        this.Battler1 = pokemon1;
        this.Battler2 = pokemon2;
    }

    Simulate() {
        do {

            if(this.Battler1.IsAlive() && this.Battler2.IsAlive()) {
                this.SimulateTurn(this.Battler1, this.Battler2);
            } else {
                break;
            }
            
            if(this.Battler1.IsAlive() && this.Battler2.IsAlive()) {
                this.SimulateTurn(this.Battler2, this.Battler1);
            } else {
                break;
            }

            this.Battler1.Tick();
            this.Battler2.Tick();

        } while(this.Battler1.IsAlive() && this.Battler2.IsAlive());

        if(this.Battler1.Health >= this.Battler2.Health) {
            return new SimulationResult(this.Battler1, this.Battler2);
        }

        return new SimulationResult(this.Battler2, this.Battler1);
    }

    private SimulateTurn(attacker: Battler, defender: Battler) {
        
        if(attacker.CanAct()) {
            if(attacker.CanUseChargeMove()
            // && !attacker.CanUseFastMoveBeforeTargetCanAct(defender)
            && !attacker.CanKillTarget(defender, attacker.FastMove)) {

                attacker.DeclareAttack(attacker.ChargeMove);

                if(defender.CanUseShield()) {
                    defender.UseShield();
                    defender.ApplyShieldCooldown();
                    attacker.FoilAttack();
                } else {
                    defender.ApplyShieldCooldown();
                    attacker.ExecuteAttack(defender)
                }

            } else {
                attacker.DeclareAttack(attacker.FastMove);
                attacker.ExecuteAttack(defender);
            }
        }
    }
}
