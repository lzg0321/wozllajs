this.wozllajs = this.wozllajs || {};

this.wozllajs.Touch = (function() {

    var topCanvas;
    var touchEnabled = true;

    var mouseTouchMap = {
        'mousedown' : 'touchstart',
        'mouseup' : 'touchend',
        'mousemove' : 'touchmove'
    };

    var activeGestures = {
        'touchstart' : true,
        'touchend' : true,
        'touchmove' : false,
        'click' : true,
        'dblclick' : true
    };

    var listenerHolder = new wozllajs.EventDispatcher();
    var objectTouchListenerMap = {};
    var touchedGameObject;
    var touchedListener;

    function getCanvasOffset() {
        var obj = topCanvas;
        var offset = { x : obj.offsetLeft, y : obj.offsetTop };
        while ( obj = obj.offsetParent ) {
            offset.x += obj.offsetLeft;
            offset.y += obj.offsetTop;
        }
        return offset;
    }

    function dispatchEvent(e) {
        var type = e.type;
        if(!touchEnabled || !activeGestures[type]) return;
        switch (type) {
            case 'touchstart' : onTouchStart(e); break;
            case 'touchmove' : onTouchMove(e); break;
            case 'touchend' : onTouchEnd(e); break;
            case 'click' : onClick(e); break;
            case 'dblclick' : onDblClick(e); break;
        }
    }

    function onTouchStart(e) {
        var i, len, listeners, listener;
        var gameObject, handler;
        var type = e.type;
        var x = e.x;
        var y = e.y;
        touchedGameObject = null;
        touchedListener = null;
        listeners = listenerHolder.getListenersByType(type);
        if(listeners) {
            for(i=0,len=listeners.length; i<len; i++) {
                listener = listeners[i];
                gameObject = listener.gameObject;
                handler = listener.handler;
                if(touchedGameObject && touchedGameObject === gameObject) {
                    handler && handler(e);
                }
                else if(gameObject.testHit(x, y)) {
                    touchedGameObject = gameObject;
                    touchedListener = listener;
                    handler && handler(e);
                }
            }
        }
    }

    function onTouchMove(e) {
        var i, len, listeners, listener;
        var gameObject, handler;
        var type = e.type;
        listeners = listenerHolder.getListenersByType(type);
        if(listeners) {
            for(i=0,len=listeners.length; i<len; i++) {
                listener = listeners[i];
                gameObject = listener.gameObject;
                handler = listener.handler;
                if(touchedGameObject && touchedGameObject === gameObject) {
                    handler && handler(e);
                }
            }
        }
    }

    function onTouchEnd(e) {
        var i, len, listeners, listener;
        var gameObject, handler;
        var type = e.type;
        listeners = listenerHolder.getListenersByType(type);
        if(listeners) {
            for(i=0,len=listeners.length; i<len; i++) {
                listener = listeners[i];
                gameObject = listener.gameObject;
                handler = listener.handler;
                if(touchedGameObject && touchedGameObject === gameObject) {
                    handler && handler(e);
                }
            }
        }
    }

    function onClick(e) {
        var i, len, listeners, listener;
        var gameObject, handler;
        var type = e.type;
        var x = e.x;
        var y = e.y;
        listeners = listenerHolder.getListenersByType(type);
        if(listeners) {
            for(i=0,len=listeners.length; i<len; i++) {
                listener = listeners[i];
                gameObject = listener.gameObject;
                handler = listener.handler;
                if(touchedGameObject && touchedGameObject === gameObject && gameObject.testHit(x, y)) {
                    handler && handler(e);
                }
            }
        }
    }

    function onEvent(e) {
        var touchEvent, canvasOffset, x, y;
        var type = e.type;
        canvasOffset = getCanvasOffset();
        if (!e.touches) {
            x = e.pageX - canvasOffset.x;
            y = e.pageY - canvasOffset.y;
        }
        else if(e.changedTouches) {
            var t = e.changedTouches[0];
            x = t.pageX - canvasOffset.x;
            y = t.pageY - canvasOffset.y;
        }
        if(type === 'mousedown') {
            type = 'touchstart';
        }
        else if(type === 'mouseup') {
            type = 'touchend';
        }
        else if(type === 'mousemove') {
            type = 'touchmove';
        }
        touchEvent = new wozllajs.TouchEvent(x, y, type, e);
        dispatchEvent(touchEvent);
    }


    return {

        init : function(canvas) {
            topCanvas = canvas;
            if(wozllajs.isTouchSupport) {
                canvas.addEventListener("touchstart", onEvent, false);
                canvas.addEventListener("touchend", onEvent, false);
                canvas.addEventListener("touchmove", onEvent, false);
            } else {
                canvas.addEventListener("mousedown", onEvent, false);
                canvas.addEventListener("mouseup", onEvent, false);
                canvas.addEventListener("mousemove", onEvent, false);
            }
            canvas.addEventListener("click", onEvent, false);
        },

        dispatchEvent : function(stageTouchEvent) {
            dispatchEvent(stageTouchEvent);
        },

        disable : function() {
            touchEnabled = false;
        },

        enable : function() {
            touchEnabled = true;
        },

        isTouchEvent : function(type) {
            return activeGestures[type] !== undefined;
        },

        on : function(type, gameObject, listener) {
            var getLayerZ = wozllajs.LayerManager.getLayerZ;
            type = mouseTouchMap[type] || type;
            listenerHolder.addEventListener(type, {
                gameObject : gameObject,
                handler : listener
            });
            listenerHolder.sort(type, function(a, b) {
                return getLayerZ(b.gameObject.getLayer(true)) - getLayerZ(a.gameObject.getLayer(true));
            });
        },

        off : function(type, gameObject, listener) {
            var i, l, len;
            var listeners = listenerHolder.get(type);
            type = mouseTouchMap[type] || type;
            if(listeners) {
                for(i=0,len=listeners.length; i<len; i++) {
                    l = listeners[i];
                    if(l.gameObject === gameObject && l.listener === listener) {
                        listenerHolder.remove(type, l);
                        return;
                    }
                }
            }
        }
    }

})();