define.factoryProxy = function(callback, args, exports) {
    if(window.wozllajs && window.wozllajs.Annotation) {
        var annotation = new wozllajs.Annotation();
        exports = callback.apply(exports, args);
        if(!annotation.isEmpty()) {
            wozllajs.AnnotationRegistry.register(exports, annotation);
        }
        return exports;
    }
    return callback.apply(exports, args);
};

define([
    './wozllajs',
    './promise',
    './annotation',
    './ajax',
    './events',
    './preload',
    './core'
], function(wozllajs, Promise) {

    wozllajs.Promise = Promise;

    // export modules
    var modules = wozllajs.slice(arguments, 2);
    var i, len, m, p;
    for(i=0,len=modules.length; i<len; i++) {
        m = modules[i];
        if(typeof m === 'function') {
            continue;
        }
        for(p in m) {
            wozllajs[p] = m[p];
        }
    }


    return window.wozllajs = wozllajs;
});