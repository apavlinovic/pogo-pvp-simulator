import { Battler } from "../Models/Battler";

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

        } while(this.Battler1.IsAlive() && this.Battler2.IsAlive())
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

        attacker.Tick();
    }
}
