define([
    './../var',
    './Annotation',
    './../core/AbstractGameObject'
], function(W, Annotation, AbstractGameObject) {

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