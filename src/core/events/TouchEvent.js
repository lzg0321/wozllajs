define(function(require) {

    var Objects = require('../../utils/Objects');
    var Event = require('../../events/Event');

    var TouchEvent = function(param) {
        Event.apply(this, arguments);
        this.x = param.x;
        this.y = param.y;
        this.touch = param.touch;
		this.touches = param.touches;
		this.touchMoveDetection = false;
    };

    TouchEvent.TOUCH_START = 'touchstart';
    TouchEvent.TOUCH_END = 'touchend';
    TouchEvent.TOUCH_MOVE = 'touchmove';
    TouchEvent.CLICK = 'click';

    var p = Objects.inherits(TouchEvent, Event);

	p.setTouchMoveDetection = function(flag) {
		this.touchMoveDetection = flag;
	};

    return TouchEvent;

});