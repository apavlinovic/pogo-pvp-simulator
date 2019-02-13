import { TimelineEventType, TimelineEvent } from "../Simulator/Timeline";
import * as colors from 'colors';
import { SimulationResult } from "../Simulator/SimulationResult";
import _ = require("lodash");

export class Printer {

    PrintBattleOutcome(battle: SimulationResult) {
        console.log(
            colors.green(battle.Winner.Pokemon.ID),
            colors.yellow(battle.Winner.FastMove.ID),
            colors.yellow(battle.Winner.ChargeMove.ID),
            battle.WinnerEfficiency() / battle.CombatTime() * 1000000,
        )
    }

    PrintBattleTimeline(battle: SimulationResult) {

        if(!battle.Winner.Timeline || !battle.Looser.Timeline) {
            console.log("Timeline tracking not enabled for battlers.");
            return;
        }
        
        let timeline = battle.Winner.Timeline.ZipWithAnotherTimeline(battle.Looser.Timeline);
        

        _(timeline).orderBy(t => t[0]).forEach(event => {

            let timeline_turns : string = event[0].toString();
            let timeline_battler_1 : string = "";
            let timeline_battler_2 : string = "";
            
            timeline_battler_1 = this.EventToPrintableEvent(event[1]);
            timeline_battler_2 = this.EventToPrintableEvent(event[2]);

            console.log(timeline_turns, timeline_battler_1, timeline_battler_2)
        });


    }

    private EventToPrintableEvent(event: TimelineEvent | null) {
        if(event) {
            if(event.Type == TimelineEventType.FastMove)
                return 'FF';
            else if (event.Type == TimelineEventType.ChargeMove)
                return 'CC';
            else if (event.Type == TimelineEventType.Shield)
                return 'SS';
        }

        return'--';
    }
}