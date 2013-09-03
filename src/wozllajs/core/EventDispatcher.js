this.wozllajs = this.wozllajs || {};

(function() {

	var EventDispatcher = function() {
		this.listenerMap = new wozllajs.Array2D();
	};
	
	EventDispatcher.prototype = {
        addEventListener : function(type, listener) {
            this.listenerMap.push(type, listener);
        },
        removeEventListener : function(type, listener) {
            this.listenerMap.remove(type, listener);
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
        sort : function(func) {
            this.listenerMap.sort(func);
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
                    (function(l) {
                        setTimeout(function() {
                            l.apply(l, [params]);
                        }, 0);
                    })(listener);
                }
            } else {
                for(i=0, len=listeners.length; i<len; i++) {
                    listener = listeners[i];
                   if(false === listener.apply(listener, [params])) {
                       return;
                   }
                }
            }
        }
    };

    wozllajs.EventDispatcher = EventDispatcher;

})();