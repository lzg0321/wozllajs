define([
    './../var',
    './Annotation'
], function(W, Annotation) {

    return Annotation.define('$Inject', {
        type : {
            type : Object,
            defaults : null
        },
        value : {
            type : 'string',
            defaults : null
        }
    });

});