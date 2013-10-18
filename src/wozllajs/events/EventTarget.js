this.wozllajs = this.wozllajs || {};

(function() {

    function EventTarget() {
        this._captureListeners = {};
        this._listeners = {};
    }

    EventTarget.DEFAULT_ACTION_MAP = {
        'touchstart' : 'onTouchStart',
        'touchmove' : 'onTouchMove',
        'touchend' : 'onTouchEnd',
        'tap' : 'onTap',
        'click' : 'onClick'
    };

    EventTarget.prototype = {

        addEventListener : function(eventType, listener, useCapture) {
            var listeners = useCapture ? this._captureListeners : this._listeners;
            var arr = listeners[eventType];
            if (arr) { this.removeEventListener(eventType, listener, useCapture); }
            arr = listeners[eventType];
            if (!arr) {
                listeners[eventType] = [listener];
            }
            else {
                arr.push(listener);
            }
            return listener;
        },

        removeEventListener : function(eventType, listener, useCapture) {
            var listeners = useCapture ? this._captureListeners : this._listeners;
            if (!listeners) { return; }
            var arr = listeners[eventType];
            if (!arr) { return; }
            for (var i=0,l=arr.length; i<l; i++) {
                if (arr[i] == listener) {
                    if (l==1) {
                        delete(listeners[eventType]);
                    }
                    else { arr.splice(i,1); }
                    break;
                }
            }
        },

        hasEventListener : function(eventType) {
            var listeners = this._listeners, captureListeners = this._captureListeners;
            return !!((listeners && listeners[eventType]) || (captureListeners && captureListeners[eventType]));
        },

        dispatchEvent : function(event) {
            var i, len, list, object, defaultAction;
            event.target = this;
            if(!event.bubbles) {
                event.eventPhase = wozllajs.Event.TARGET_PHASE;
                if(!this._dispatchEvent(event)) {
                    defaultAction = this[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                    defaultAction && defaultAction(event);
                }
                return;
            }

            list = this.getAncients();
            event.eventPhase = wozllajs.Event.CAPTURING_PHASE;
            for(i=list.length-1; i>=0 ; i--) {
                object = list[i];
                if(!object._dispatchEvent(event)) {
                    defaultAction = object[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                    defaultAction && defaultAction(event);
                }
                if(event._stopPropagation) {
                    return;
                }
            }
            event.eventPhase = wozllajs.Event.TARGET_PHASE;
            if(!this._dispatchEvent(event)) {
                defaultAction = this[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            if(event._stopPropagation) {
                return;
            }
            event.eventPhase = wozllajs.Event.BUBBLING_PHASE;
            for(i=0,len=list.length; i<len; i++) {
                object = list[i];
                if(!object._dispatchEvent(event)) {
                    defaultAction = object[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                    defaultAction && defaultAction(event);
                }
                if(event._stopPropagation) {
                    return;
                }
            }
        },

        getAncients : function() {
            var list = [];
            var parent = this;
            while (parent._parent) {
                parent = parent._parent;
                list.push(parent);
            }
            return list;
        },

        _dispatchEvent : function(event) {
            var i, len, arr, listeners, handler;
            event.currentTarget = this;
            event.removed = false;
            listeners = event.eventPhase === wozllajs.Event.CAPTURING_PHASE ? this._captureListeners : this._listeners;
            if(listeners) {
                arr = listeners[event.type];
                if(!arr || arr.length === 0) return;
                arr = arr.slice();
                for(i=0,len=arr.length; i<len; i++) {
                    handler = arr[i];
                    handler(event);
                    if(event.removed) {
                        this.removeEventListener(event.type, handler, event.eventPhase === wozllajs.Event.CAPTURING_PHASE);
                    }
                    if(event._stopImmediatePropagation) {
                        break;
                    }
                }
            }
            return event._preventDefault;
        }

    };

    wozllajs.EventTarget = EventTarget;

})();