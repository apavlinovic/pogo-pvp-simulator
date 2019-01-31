import { TimelineEventType } from "../Simulator/Timeline";
import * as colors from 'colors';
import { SimulationResult } from "../Simulator/SimulationResult";

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
        
        let timeline_battler_1 = Array();
        let timeline_battler_2 = Array();
        let timeline_turns = Array();
        
        timeline.forEach(event => {
            timeline_turns.push(event[0].toString().padStart(2, '0'));
            
            if(event[1]) {
                if(event[1].Type == TimelineEventType.FastMove)
                timeline_battler_1.push('FF')
                else if (event[1].Type == TimelineEventType.ChargeMove)
                timeline_battler_1.push('CC')
                else if (event[1].Type == TimelineEventType.Shield)
                timeline_battler_1.push('SS')
            } else {
                timeline_battler_1.push('--')
            }
            
            if(event[2]) {
                if(event[2].Type == TimelineEventType.FastMove)
                timeline_battler_2.push('FF')
                else if (event[2].Type == TimelineEventType.ChargeMove)
                timeline_battler_2.push('CC')
                else if (event[2].Type == TimelineEventType.Shield)
                timeline_battler_2.push('SS')
            } else {
                timeline_battler_2.push('--')
            }
            
        });

        console.log(timeline_battler_1.join(' '));
        console.log(timeline_battler_2.join(' '));
        console.log(timeline_turns.join(' '));
    }
}