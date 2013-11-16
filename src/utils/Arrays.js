define(function (require, exports, module) {

    var toString = Object.prototype.toString;
    var slice = Array.prototype.slice;

    exports.is = function(test) {
        return toString.call(test) === '[object Array]';
    };

    exports.isArray = function(test) {
        return exports.is(test);
    };

    exports.slice = function(args) {
        return slice.apply(args, slice.apply(arguments, [1]));
    };

});