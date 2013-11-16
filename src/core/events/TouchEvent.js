define(function(require) {

    var Objects = require('../../utils/Objects');
    var Event = require('../../events/Event');

    var TouchEvent = function(param) {
        Event.apply(this, arguments);
        this.x = param.x;
        this.y = param.y;
        this.touch = param.touch;
    };

    TouchEvent.TOUCH_START = 'touchstart';
    TouchEvent.TOUCH_END = 'touchend';
    TouchEvent.TOUCH_MOVE = 'touchmove';
    TouchEvent.CLICK = 'click';

    Objects.inherits(TouchEvent, Event);

    return TouchEvent;

});