define(function(require) {

    var TouchEvent = require('./events/TouchEvent');

    var stage;
    var enabled = true;
	var multiTouchEnabled = false;

	var touchIdentifier = null;
	var touchMoveDetection = true;
    var touchstartTarget;
	var touches = [];

    var canvasOffsetCache;

    function getCanvasOffset() {
        if(canvasOffsetCache) return canvasOffsetCache;
        var obj = stage.stageCanvas;
        var offset = { x : obj.offsetLeft, y : obj.offsetTop };
        while ( obj = obj.offsetParent ) {
            offset.x += obj.offsetLeft;
            offset.y += obj.offsetTop;
        }
        canvasOffsetCache = offset;
        return offset;
    }

    function onEvent(e) {
        if(!enabled) return;
		var i, len, inTouchList;
        var canvasOffset, x, y, t;
        var type = e.type;
        var target;
		var touchEvent;
		var identifier = 'MouseEvent';
		var verifiedIdentifier = true;
        canvasOffset = getCanvasOffset();

		if(type === 'mousedown') {
			type = TouchEvent.TOUCH_START;
		}
		else if(type === 'mousemove') {
			type = TouchEvent.TOUCH_MOVE;
		}
		else if(type === 'mouseup') {
			type = TouchEvent.TOUCH_END;
		}

        // mouse event
        if (!e.changedTouches) {
            x = e.pageX - canvasOffset.x;
            y = e.pageY - canvasOffset.y;
        }
        // touch event
        else if(e.changedTouches) {
            t = e.changedTouches[0];
			identifier = t.identifier;
            x = t.pageX - canvasOffset.x;
            y = t.pageY - canvasOffset.y;
        }

		//if(type === 'mousedown' || type === TouchEvent.TOUCH_START || touchstartTarget) {
        if(type === TouchEvent.TOUCH_MOVE) {
			if(touchMoveDetection) {
				target = stage.getTopObjectUnderPoint(x, y, true);
			} else {
				target = touchstartTarget;
			}
		} else {
			target = stage.getTopObjectUnderPoint(x, y, true);
		}
		//}
        if(type === TouchEvent.TOUCH_START) {
			touches.length = 0;
			if(touchIdentifier === null) {
				touchIdentifier = identifier;
				touchstartTarget = target;
			} else {
				verifiedIdentifier = false;
			}
        }
        else if(type === TouchEvent.TOUCH_END && touchstartTarget) {
			verifiedIdentifier = identifier === touchIdentifier;
        }
        else if(type === TouchEvent.TOUCH_MOVE && touchstartTarget) {
			verifiedIdentifier = identifier === touchIdentifier;
        }

		if(multiTouchEnabled && verifiedIdentifier && target) {
			for(i=0,len=touches.length; i<len; i++) {
				if(touches[i] === target) {
					inTouchList = true;
					break;
				}
			}
			!inTouchList && touches.push(target);
		}

        if(touchstartTarget && verifiedIdentifier) {
			touchEvent = new TouchEvent({
				type : type,
				x : x,
				y : y,
				bubbles: true,
				touch: target,
				touches : touches
			});

			touchstartTarget.dispatchEvent(touchEvent);
			if(type === TouchEvent.TOUCH_START) {
				touchMoveDetection = touchEvent.touchMoveDetection;
			}
			else if(type === TouchEvent.TOUCH_END) {
				touchMoveDetection = true;
			}

            if(type === TouchEvent.TOUCH_END) {
                if(touchstartTarget && touchstartTarget === target) {
					target.dispatchEvent(new TouchEvent({
                        type : TouchEvent.CLICK,
                        x : x,
                        y : y,
                        bubbles: true,
                        touch : target,
						touches : touches
                    }));
                }

				touchstartTarget = null;
				touchIdentifier = null;
            }
        }
    }


    return {
        init : function(theStage) {
			var down = 0;
            var canvas = theStage.stageCanvas;
            stage = theStage;

            if('ontouchstart' in window) {
                canvas.addEventListener("touchstart", function(e) {
					down++;
//					if(down === 1) {
						onEvent(e);
//					}
				}, false);
                canvas.addEventListener("touchend", function(e) {
					down--;
//					if(down === 0) {
						onEvent(e);
//					}
				}, false);
                canvas.addEventListener("touchmove", function(e) {
//					if(down === 1) {
						onEvent(e);
//					}
				}, false);
            } else {
                canvas.addEventListener("mousedown", function(e) {
                    down = true;
					onEvent(e);
                }, false);
                canvas.addEventListener("mouseup", function(e) {
					down = false;
					onEvent(e);
                }, false);
                canvas.addEventListener("mousemove", function(e) {
                    if(down) {
                        onEvent(e);
                    }
                }, false);
            }
        },

		setMultiTouches : function(flag) {
			multiTouchEnabled = flag;
		},
        enable : function() {
            enabled = true;
        },
        disable : function() {
            enabled = false;
        }
    }
});