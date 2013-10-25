define([
    './var/isArray',
    './var/isImage',
    './var/extend',
    './var/uniqueKey',
    './var/slice',
    './var/createCanvas',
    './var/support',
    './globals'
], function(isArray, isImage,  extend, uniqueKey, slice, createCanvas, support, globals) {

    var wozllajs = {
        isArray : isArray,
        isImage : isImage,
        extend : extend,
        uniqueKey : uniqueKey,
        slice : slice,
        createCanvas : createCanvas,
        support : support
    };

    for(var i in globals) {
        wozllajs[i] = globals[i];
    }

    return window.wozllajs = wozllajs;
});
