define([
    './../var/support',
    './events/TouchEvent'
], function(support, TouchEvent) {

    var stage;
    var enabled = true;

    var touchstartTarget;
    var touchendTarget;
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
        var doDispatch = false;
        var target, touchEvent, canvasOffset, x, y, t;
        var type = e.type;
        canvasOffset = getCanvasOffset();
        // mouse event
        if (!e.touches) {
            x = e.pageX - canvasOffset.x;
            y = e.pageY - canvasOffset.y;
        }
        // touch event
        else if(e.changedTouches) {
            t = e.changedTouches[0];
            x = t.pageX - canvasOffset.x;
            y = t.pageY - canvasOffset.y;
        }

        target = stage.getTopObjectUnderPoint(x, y);

        if(type === 'mousedown') {
            type = TouchEvent.TOUCH_START;
            touchstartTarget = target;
            touchendTarget = null;
            doDispatch = true;
        }
        else if(type === 'mouseup' && touchstartTarget === target) {
            type = TouchEvent.TOUCH_END;
            touchendTarget = target;
            doDispatch = true;
        }
        else if(type === 'mousemove' && touchstartTarget === target) {
            type = TouchEvent.TOUCH_MOVE;
            doDispatch = true;
        }

        if(target && doDispatch) {
            touchEvent = new TouchEvent({
                type : type,
                x : x,
                y : y
            });
            target.dispatchEvent(touchEvent);
            if(type === TouchEvent.TOUCH_END) {
                if(touchendTarget && touchstartTarget === touchendTarget) {
                    touchstartTarget = null;
                    touchendTarget = null;
                    touchendTarget.dispatchEvent(new TouchEvent({
                        type : TouchEvent.CLICK,
                        x : x,
                        y : y
                    }));
                }
            }
        }
    }


    return {
        init : function(theStage) {
            var canvas = theStage.stageCanvas;
            stage = theStage;

            if(support.touch) {
                canvas.addEventListener("touchstart", onEvent, false);
                canvas.addEventListener("touchend", onEvent, false);
                canvas.addEventListener("touchmove", onEvent, false);
            } else {
                var down = false;
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
        enable : function() {
            enabled = true;
        },
        disable : function() {
            enabled = false;
        }
    }
});