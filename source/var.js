define([
    './var/isArray',
    './var/isImage',
    './var/inherits',
    './var/uniqueKey',
    './var/slice',
    './var/createCanvas',
    './var/support',
    './var/getSuperConstructor',
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
