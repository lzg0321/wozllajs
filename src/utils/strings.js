define(function (require, exports, module) {

    exports.endWith = function(test, suffix) {
        if(!exports.is(test)) {
            return false;
        }
        return test.lastIndexOf(suffix) === test.length - suffix.length;
    };

    exports.startWith = function(test, prefix) {
        if(!exports.is(test)) {
            return false;
        }
        return test.indexOf(prefix) === 0;
    };

    exports.is = function(test) {
        return typeof test === 'string';
    };

});