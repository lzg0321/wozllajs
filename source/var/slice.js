define(function() {

    return function(argsObj) {
        var ags = Array.prototype.slice.apply(arguments, [1]);
        return Array.prototype.slice.apply(argsObj, ags);
    };

});