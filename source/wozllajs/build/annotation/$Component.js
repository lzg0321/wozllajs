define([
    './../../annotation/Annotation'
], function(Annotation) {

    return Annotation.define('$Component', {
        id : {
            type : 'string',
            default: null
        },
        constructor : {
            type : 'function',
            default : null
        }
    });

});