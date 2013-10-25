define(function() {

    var toString = Object.prototype.toString;

    return function(testObj) {
        return toString.call(testObj) === '[object Array]';
    };

});