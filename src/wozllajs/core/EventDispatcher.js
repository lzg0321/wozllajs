this.wozllajs = this.wozllajs || {};

(function() {

	var EventDispatcher = function() {
		this.listenerMap = new wozllajs.Array2D();
	};
	
	EventDispatcher.prototype = {
        addEventListener : function(type, listener, once) {
            if(once) {
                listener._once_flag = true;
            }
            this.listenerMap.push(type, listener);
        },
        removeEventListener : function(type, listener) {
            return this.listenerMap.remove(type, listener);
        },
        getListenersByType : function(type) {
            return this.listenerMap.get(type);
        },
        getListenerMap : function() {
            return this.listenerMap;
        },
        clearByType : function(type) {
            this.listenerMap.clear(type);
        },
        clear : function() {
            this.listenerMap.clear();
        },
        sort : function(type, func) {
            this.listenerMap.sort(type, func);
        },
        fireEvent : function(type, params, async) {
            var i, len, listener, ret;
            var listeners = this.getListenersByType(type);
            if(!listeners || listeners.length === 0) {
                return;
            }
            // 复制一份，这样在下面的循环中即使有remove操作也不会导致一个遍历错误
            listeners = [].concat(listeners);
            if(async) {
                for(i=0, len=listeners.length; i<len; i++) {
                    listener = listeners[i];
                    (function(d, t, p, l) {
                        setTimeout(function() {
                            if(l._once_flag) {
                                d.removeEventListener(t, l);
                            }
                            l.apply(l, [p]);
                        }, 0);
                    })(this, type, params, listener);
                }
            } else {
                for(i=0, len=listeners.length; i<len; i++) {
                    listener = listeners[i];
                    if(listener._once_flag) {
                        this.removeEventListener(type, listener);
                    }
                    if(false === listener.apply(listener, [params])) {
                        return;
                    }
                }
            }
        }
    };

    wozllajs.EventDispatcher = EventDispatcher;

})();