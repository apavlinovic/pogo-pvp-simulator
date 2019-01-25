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
            
            this.AdvanceTimelineFor(this.Battler1, this.Timeline_Battler1, this.Battler2, this.Timeline_Battler2);
            this.AdvanceTimelineFor(this.Battler2, this.Timeline_Battler2, this.Battler1, this.Timeline_Battler1);

        } while(this.Battler1.IsAlive() && this.Battler2.IsAlive())
    }

    private AdvanceTimelineFor(attacker: Battler,  attackerTimeline: Timeline, 
        defender: Battler, defenderTimeline: Timeline) {
        
        if(attackerTimeline.CanAct()) {
            
            let damage = 0;

            if(attacker.CanUseChargeMove()) {
                
                attacker.ActivateMove(attacker.ChargeMove);
                attackerTimeline.AddEvent(new TimelineEvent(attacker.ChargeMove.Turns, TimelineEventType.ChargeMove));
                
                damage = attacker.CalculateDamage(defender, attacker.ChargeMove);

                if(defender.CanUseShield()) {
                    damage = 0;

                    defender.ActivateShield();
                    defenderTimeline.AddEvent(new TimelineEvent(attacker.ChargeMove.Turns, TimelineEventType.Shield));
                }

            } else {
                damage = attacker.CalculateDamage(defender, attacker.FastMove);
                
                attacker.ActivateMove(attacker.FastMove);
                attackerTimeline.AddEvent(new TimelineEvent(attacker.FastMove.Turns, TimelineEventType.FastMove));
            }

            defender.TakeDamage(damage);
        }

        attackerTimeline.NextTurn();
    }
}
