Class.module('wozllajs.util.EventDispatcher', function() {

    var listenerMap = wozllajs.util.Array2D();

    return {
        addEventListener : function(type, listener) {
            listenerMap.push(type, listener);
        },
        removeEventListener : function(type, listener) {
            listenerMap.remove(type, listener);
        },
        getListenersByType : function(type) {
            return listenerMap.get(type);
        },
        getListenerMap : function() {
            return listenerMap;
        },
        clearByType : function(type) {
            listenerMap.clear(type);
        },
        clear : function() {
            listenerMap.clear();
        },
        fireEvent : function(type, params, async) {
            var i, len, listener;
            var listeners = this.getListenersByType(type);
            if(!listeners || listeners.length === 0) {
                return;
            }
            // 复制一份，这样在下的循环中即使有remove操作也不会导致一个遍历错误
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
                    listener.apply(listener, params);
                }
            }
        }
    }

});