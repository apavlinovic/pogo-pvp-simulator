
export class Timeline {

    Events: Array<TimelineEvent>;
    

    constructor() {

        this.Events = new Array;
    }

    AddEvent(event: TimelineEvent) {
        
        this.Events.push(event);
    }
}

export class TimelineEvent {

    Duration: number | null;
    Turn!: number | null;
    Type: TimelineEventType;
    
    constructor(duration: number | null, type: TimelineEventType) {
        
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