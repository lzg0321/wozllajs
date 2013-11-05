define([
    './wozllajs/var',
    './wozllajs/promise',
    './wozllajs/math',
    './wozllajs/annotation',
    './wozllajs/factoryProxy',
    './wozllajs/ajax',
    './wozllajs/events',
    './wozllajs/preload',
    './wozllajs/assets',
    './wozllajs/core',
    './wozllajs/component',
    './wozllajs/build'
], function(wozllajs, Promise) {

    wozllajs.Promise = Promise;

    // export modules
    var modules = wozllajs.slice(arguments, 2);
    var i, len, m, p;
    for(i=0,len=modules.length; i<len; i++) {
        m = modules[i];
        for(p in m) {
            wozllajs[p] = m[p];
        }
    }

    return window.wozllajs = wozllajs;
});