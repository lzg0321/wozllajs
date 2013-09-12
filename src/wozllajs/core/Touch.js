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

    function emptyTouchStart() {}
    var listenerHolder = new wozllajs.EventDispatcher();
    var objectTouchListenerMap = {};
    var touchedGameObject;

    function getCanvasOffset() {
        var obj = topCanvas;
        var offset = { x : obj.offsetLeft, y : obj.offsetTop };
        while ( obj = obj.offsetParent ) {
            offset.x += obj.offsetLeft;
            offset.y += obj.offsetTop;
        }
        return offset;
    }

    function getListenerTouchStartKey() {
        return '_listener_touchstart';
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
        var gameObject, handler, localPos;
        var type = e.type;
        var x = e.x;
        var y = e.y;
        touchedGameObject = null;
        listeners = listenerHolder.getListenersByType(type);
        if(listeners) {
            listeners = [].concat(listeners);
            for(i=0,len=listeners.length; i<len; i++) {
                listener = listeners[i];
                gameObject = listener.gameObject;
                handler = listener.handler;
                if(!touchedGameObject) {
                    localPos = gameObject.transform.globalToLocal(x, y);
                    if(gameObject.testHit(localPos.x, localPos.y)) {
                        touchedGameObject = gameObject;
                        handler && handler(e);
                    }
                }
                else if(touchedGameObject === gameObject) {
                    if(handler && handler !== emptyTouchStart) {
                        handler(e);
                    }
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
            listeners = [].concat(listeners);
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
            listeners = [].concat(listeners);
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
        var gameObject, handler, localPos;
        var type = e.type;
        var x = e.x;
        var y = e.y;
        listeners = [].concat(listenerHolder.getListenersByType(type));
        if(listeners) {
            listeners = [].concat(listeners);
            for(i=0,len=listeners.length; i<len; i++) {
                listener = listeners[i];
                gameObject = listener.gameObject;
                handler = listener.handler;
                if(touchedGameObject && touchedGameObject === gameObject) {
                    localPos = gameObject.transform.globalToLocal(x, y);
                    if(gameObject.testHit(localPos.x, localPos.y)) {
                        handler && handler(e);
                    }
                }
            }
        }
    }

    function onEvent(e) {
        var touchEvent, canvasOffset, x, y, t;
        var type = e.type;
        canvasOffset = getCanvasOffset();
        if (!e.touches) {
            x = e.pageX - canvasOffset.x;
            y = e.pageY - canvasOffset.y;
        }
        // touch event
        else if(e.changedTouches) {
            t = e.changedTouches[0];
            if(e.type === 'click') {
                x = e.pageX - canvasOffset.x;
                y = e.pageY - canvasOffset.y;
            } else {
                x = t.pageX - canvasOffset.x;
                y = t.pageY - canvasOffset.y;
            }
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
            var autoTouchstartList, autoTouchstart;
            var layerZ = wozllajs.LayerManager.getLayerZ(gameObject.getEventLayer());
            type = mouseTouchMap[type] || type;
            if(type !== 'touchstart') {
                autoTouchstartList = listener[getListenerTouchStartKey()]
                    = listener[getListenerTouchStartKey()] || [];
                autoTouchstart = {
                    gameObject : gameObject,
                    handler : emptyTouchStart,
                    layerZ : layerZ
                };
                autoTouchstartList.push(autoTouchstart);
                listenerHolder.addEventListener('touchstart', autoTouchstart);
                listenerHolder.sort('touchstart', function(a, b) {
                    return b.layerZ - a.layerZ;
                });
            }
            listenerHolder.addEventListener(type, {
                gameObject : gameObject,
                handler : listener,
                layerZ : layerZ
            });
            listenerHolder.sort(type, function(a, b) {
                return b.layerZ - a.layerZ;
            });
        },

        off : function(type, gameObject, listener) {
            var i, l, len, j, len2, autoTouchstartList;
            var listeners = listenerHolder.getListenersByType(type);
            type = mouseTouchMap[type] || type;
            if(listeners) {
                for(i=0,len=listeners.length; i<len; i++) {
                    l = listeners[i];
                    if(l.gameObject === gameObject && l.handler === listener) {

                        listenerHolder.removeEventListener(type, l);
                        autoTouchstartList = listener[getListenerTouchStartKey()];
                        if(autoTouchstartList) {
                            for(j=0,len2=autoTouchstartList.length; j<len2; j++) {
                                listenerHolder.removeEventListener('touchstart', autoTouchstartList[j]);
                            }
                            delete listener[getListenerTouchStartKey()];
                        }
                        return;
                    }
                }
            }
        },

        getListenerHolder : function() {
            return listenerHolder;
        }
    }

})();