define([
    './../../var',
    './../../events/Event'
], function(W, Event) {

    var GameObjectEvent = function(param) {
        Event.apply(this, arguments);
    };

    GameObjectEvent.INIT = 'init';
    GameObjectEvent.DESTROY = 'destroy';
    GameObjectEvent.CHANGED = 'changed';
    /**
     * fire when child game object added , removed
     * @type {string}
     */
    GameObjectEvent.ADDED = 'added';
    GameObjectEvent.REMOVED = 'removed';

    var p = W.inherits(GameObjectEvent, Event);

    p.child = null;

    return GameObjectEvent;

});