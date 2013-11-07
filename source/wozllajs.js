// proxy define
(function() {

    var originDefine = define;

    define = function() {
        var i, len;
        var factory;
        var args = Array.prototype.slice.call(arguments);
        for(i=0,len=args.length; i<len; i++) {
            if(typeof args[i] === 'function') {
                factory = args[i];
                args[i] = function() {
                    var exports;
                    if(define.proxy) {
                        exports = define.proxy(factory, arguments, this);
                    } else {
                        exports = factory.apply(this, arguments);
                    }
                    return exports;
                };
                break;
            }
        }
        return originDefine.apply(this, args);
    }

})();

define([
    './wozllajs/var',
    './wozllajs/promise',
    './wozllajs/math',
    './wozllajs/annotation',
    './wozllajs/ajax',
    './wozllajs/events',
    './wozllajs/preload',
    './wozllajs/assets',
    './wozllajs/core',
    './wozllajs/build'
], function(wozllajs, proxyDefine, Promise) {

    wozllajs.Promise = Promise;
    // export modules
    var modules = wozllajs.slice(arguments, 3);
    var i, len, m, p;
    for(i=0,len=modules.length; i<len; i++) {
        m = modules[i];
        for(p in m) {
            wozllajs[p] = m[p];
        }
    }

    return window.wozllajs = wozllajs;
});