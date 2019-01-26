import { Battler } from "../Models/Battler";
import { Pokemon } from "../Models/Pokemon";
import { Timeline, TimelineEvent, TimelineEventType } from "./Timeline";


export class Simulator {
    Battler1: Battler;
    Timeline_Battler1: Timeline;

    Battler2: Battler;
    Timeline_Battler2: Timeline;

    constructor(pokemon1: Battler, pokemon2: Battler) {
        this.Battler1 = pokemon1;
        this.Battler2 = pokemon2;

        this.Timeline_Battler1 = new Timeline();
        this.Timeline_Battler2 = new Timeline();
    }

    PrintState() {
        console.log(this);
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
