this.wozllajs = this.wozllajs || {};

this.wozllajs.EventAdmin = (function() {

    var eventDispatcher = new wozllajs.EventDispatcher();

    return {

        on : function(type, scope, listener) {
            var proxy = listener['_wozllajs_proxy_' + type] = wozllajs.proxy(listener, scope);

            if(wozllajs.Touch.isTouchEvent(type)) {
                wozllajs.Touch.on(type, scope, listener);
                return;
            }

            eventDispatcher.addEventListener(type, proxy);
        },

        off : function(type, scope, listener) {
            var proxy = listener['_wozllajs_proxy_' + type];
            listener['_wozllajs_proxy_' + type] = false;
            if(proxy) {
                if(wozllajs.Touch.isTouchEvent(type)) {
                    wozllajs.Touch.off(type, scope, listener);
                    return;
                }
                eventDispatcher.removeEventListener(type, proxy);
            }
        },

        notify : function(type, params) {
            eventDispatcher.fireEvent(type, params);
        }

    };

})();