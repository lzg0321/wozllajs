define([
    './var/isArray',
    './var/isImage',
    './var/inherits',
    './var/uniqueKey',
    './var/slice',
    './var/createCanvas',
    './var/support',
    './globals'
], function(isArray, isImage,  extend, inherits, uniqueKey, slice, createCanvas, support, globals) {

    var vars = {
        isArray : isArray,
        isImage : isImage,
        inherits : inherits,
        uniqueKey : uniqueKey,
        slice : slice,
        createCanvas : createCanvas,
        support : support
    };

    for(var i in globals) {
        vars[i] = globals[i];
    }

    return vars;
});
