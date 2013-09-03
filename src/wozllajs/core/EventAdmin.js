this.wozllajs = this.wozllajs || {};

this.wozllajs.EventAdmin = (function() {

    var eventDispatcher = new wozllajs.EventDispatcher();

    return {

        on : function(type, gameObject, listener) {
            var proxy = listener['_wozllajs_proxy_' + type] = wozllajs.proxy(listener, gameObject);

            if(wozllajs.Touch.isTouchEvent(type)) {
                wozllajs.Touch.on(type, gameObject, listener);
                return;
            }

            eventDispatcher.addEventListener(type, proxy);
        },

        off : function(type, gameObject, listener) {
            var proxy = listener['_wozllajs_proxy_' + type];
            listener['_wozllajs_proxy_' + type] = false;
            if(proxy) {
                if(wozllajs.Touch.isTouchEvent(type)) {
                    wozllajs.Touch.off(type, gameObject, listener);
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