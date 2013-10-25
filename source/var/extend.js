define(function() {

    return function(theClass, superClass) {
        var funcName,
            theClassProto = theClass.prototype,
            newClassProto = Object.create(superClass.prototype);
        for(funcName in theClassProto) {
            if(theClassProto.hasOwnProperty(funcName)) {
                newClassProto[funcName] = theClassProto[funcName];
            }
        }
        theClass.prototype = newClassProto;
    };

});