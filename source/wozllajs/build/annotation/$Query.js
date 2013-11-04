define([
    './../../annotation/Annotation'
], function(Annotation) {

    return Annotation.define('$Query', {
        property : {
            type : 'string',
            default : null
        }
    });

});