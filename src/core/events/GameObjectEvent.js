define(function(require) {

    var Objects = require('../../utils/Objects');
    var Event = require('../../events/Event');

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

    var p = Objects.inherits(GameObjectEvent, Event);

    return GameObjectEvent;

});