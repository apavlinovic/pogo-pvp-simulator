
export class Timeline {
    Turn: number;
    NextActionableTurn: number;
    Events: Array<TimelineEvent>;
    
    static CHARGE_MOVE_TURN_DURATION = 6;

    constructor() {
        this.Turn = 0;        
        this.NextActionableTurn = 0;
        this.Events = new Array;
    }

    CanAct() {
        return this.Turn == 0 || this.Turn > this.NextActionableTurn;
    }

    NextTurn() {
        this.Turn++;
    }

    AddEvent(event: TimelineEvent) {
        this.NextActionableTurn = this.Turn + (event.Duration || Timeline.CHARGE_MOVE_TURN_DURATION);
        
        event.Turn = this.Turn;
        this.Events.push(event);
    }
}

export class TimelineEvent {

    Duration: number | null;
    Turn!: number | null;
    Type: TimelineEventType;
    
    constructor(duration: number | null, type: TimelineEventType) {
        
        if(type !== TimelineEventType.FastMove) {
            duration = Timeline.CHARGE_MOVE_TURN_DURATION;
        }
        
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