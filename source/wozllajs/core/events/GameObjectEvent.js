define([
    './../../var',
    './../../events/Event'
], function(W, Event) {

    var GameObjectEvent = function(param) {
        Event.apply(this, arguments);
    };

    GameObjectEvent.INIT = 'init';
    GameObjectEvent.DESTROY = 'destroy';

    W.inherits(GameObjectEvent, Event);

    return GameObjectEvent;

});