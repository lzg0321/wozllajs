define([
    './var/isArray',
    './../wozllajs/var/isImage',
    './../wozllajs/var/inherits',
    './../wozllajs/var/uniqueKey',
    './../wozllajs/var/slice',
    './../wozllajs/var/createCanvas',
    './../wozllajs/var/support',
    './../wozllajs/var/getSuperConstructor',
    './globals'
], function(isArray, isImage, inherits, uniqueKey, slice, createCanvas, support, getSuperConstructor, globals) {

    var vars = {
        isArray : isArray,
        isImage : isImage,
        inherits : inherits,
        uniqueKey : uniqueKey,
        slice : slice,
        createCanvas : createCanvas,
        support : support,
        getSuperConstructor : getSuperConstructor
    };

    for(var i in globals) {
        vars[i] = globals[i];
    }

    return vars;
});
