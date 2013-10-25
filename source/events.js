define([
    './wozllajs',
    './events/Event',
    './events/EventTarget'
], function(W, Event, EventTarget) {

    return {
        Event : Event,
        EventTarget : EventTarget
    };
});