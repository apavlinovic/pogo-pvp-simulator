
export class Timeline {

    Events: Array<TimelineEvent>;

    constructor() {

        this.Events = new Array;
    }

    AddEvent(event: TimelineEvent) {
        
        this.Events.push(event);
    }

    GetLastEvent() {
        return this.Events[this.Events.length - 1];
    }

    ZipWithAnotherTimeline(timeline: Timeline) {
        var zipped : any = {};

        this.Events.forEach(element => {
            zipped[element.Turn] = [ element, null ];
        });

        timeline.Events.forEach(element => {
            if(zipped[element.Turn]) {
                zipped[element.Turn][1] = element;
            } else {
                zipped[element.Turn] = [null, element];
            }
        });

        let result : Array<[number, TimelineEvent, TimelineEvent]> = new Array;

        for (const turn in zipped) {
            if (zipped.hasOwnProperty(turn)) {
                result.push([ parseFloat(turn), zipped[turn][0], zipped[turn][1] ]);
            }
        }

        return result;
    }
}

export class TimelineEvent {

    Duration: number;
    Turn: number;
    Type: TimelineEventType;
    
    constructor(turn: number, duration: number, type: TimelineEventType) {
        this.Turn = turn;
        this.Duration = duration;
        this.Type = type;
    }
}

export enum TimelineEventType {
    FastMove,
    ChargeMove,
    ChargeMove2,
    Shield
}