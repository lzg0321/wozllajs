define(function() {

    var toString = Object.prototype.toString;

    return function(testObj) {
        var str = toString.call(testObj);
        return str === '[object Image]' || str === '[object HTMLImageElement]';
    };

});