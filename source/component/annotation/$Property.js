define([
    'wozllajs/annotation/Annotation'
], function(Annotation) {

    return Annotation.define('$Property', {
        property : {
            type : 'string',
            default : null
        },
        type : {
            type : 'string',
            default : 'string'
        }
    });

});