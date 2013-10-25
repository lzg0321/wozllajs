define([
    './../../wozllajs',
    './../../events/Event'
], function(W, Event) {

    var GameObjectEvent = function(param) {
        Event.apply(this, arguments);
    };

    GameObjectEvent.INIT = 'init';
    GameObjectEvent.DESTROY = 'destroy';

    W.extend(GameObjectEvent, Event);

    return GameObjectEvent;

});