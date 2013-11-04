define([
    './../../annotation/Annotation'
], function(Annotation) {

    return Annotation.define('$Resource', {
        property : {
            type : 'string',
            default : null
        }
    });

});