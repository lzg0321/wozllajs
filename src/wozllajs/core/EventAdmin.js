this.wozllajs = this.wozllajs || {};

this.wozllajs.EventAdmin = (function() {

    var eventDispatcher = new wozllajs.EventDispatcher();

    function getProxyKey(type) {
        return '_wozllajs_proxy_' + type;
    }

    return {

        on : function(type, gameObject, listener, scope) {
            var proxyKey = getProxyKey(type);
            var proxy = wozllajs.proxy(listener, scope);
            listener[proxyKey] = listener[proxyKey] || [];
            listener[proxyKey].push(proxy);
            if(wozllajs.Touch.isTouchEvent(type)) {
                wozllajs.Touch.on(type, gameObject, proxy);
            } else {
                eventDispatcher.addEventListener(type, proxy);
            }
        },

        off : function(type, gameObject, listener) {
            var proxy, i, len;
            var proxyKey = getProxyKey(type);
            var proxies = listener[proxyKey];
            var isTouch = wozllajs.Touch.isTouchEvent(type);
            if(proxies) {
                for(i=0,len=proxies.length; i<len; i++) {
                    proxy = proxies[i];
                    if(proxy) {
                        if(isTouch) {
                            wozllajs.Touch.off(type, gameObject, proxy);
                        } else {
                            eventDispatcher.removeEventListener(type, proxy);
                        }
                    }
                }
            }
            delete listener[proxyKey];
        },

        notify : function(type, params) {
            eventDispatcher.fireEvent(type, params);
        }

    };

})();