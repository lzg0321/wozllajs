define(function(require) {

    var Objects = require('../../utils/Objects');
    var Event = require('../../events/Event');

    var GameObjectEvent = function(param) {
        Event.apply(this, arguments);
		this.child = param.child;
    };

    GameObjectEvent.INIT = 'init';
    GameObjectEvent.DESTROY = 'destroy';
    GameObjectEvent.CHANGED = 'changed';
    GameObjectEvent.ADDED = 'added';
    GameObjectEvent.REMOVED = 'removed';

    var p = Objects.inherits(GameObjectEvent, Event);

    return GameObjectEvent;

});