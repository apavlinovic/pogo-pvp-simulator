import { Timeline, TimelineEvent, TimelineEventType } from "./Timeline";

test('TimelineEvent:Creation', () => {
    let event = new TimelineEvent(null, TimelineEventType.ChargeMove);
    expect(event.Duration).toBe(Timeline.CHARGE_MOVE_TURN_DURATION);
});

test('BattleTimeline:General', () => {
    
    let timeline = new Timeline();
    expect(timeline.NextActionableTurn).toBe(0);
    expect(timeline.CanAct()).toBe(true);

    timeline.AddEvent(new TimelineEvent(1, TimelineEventType.FastMove));
    expect(timeline.NextActionableTurn).toBe(1);
    

});

test('BattleTimeline:NextActionableTurn', () => {
    let timeline = new Timeline();

    timeline.AddEvent(new TimelineEvent(5, TimelineEventType.FastMove));
    expect(timeline.NextActionableTurn).toBe(5);

    timeline.AddEvent(new TimelineEvent(15, TimelineEventType.FastMove));
    expect(timeline.NextActionableTurn).toBe(15);

    timeline.AddEvent(new TimelineEvent(25, TimelineEventType.FastMove));
    expect(timeline.NextActionableTurn).toBe(25);
});
