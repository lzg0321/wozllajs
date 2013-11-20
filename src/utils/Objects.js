define(function (require, exports, module) {

    exports.each = function(target, iterator) {
        for(var p in target) {
            if(false === iterator(p, target[p])) return;
        }
    };

    exports.inherits = function(construct, superConstruct) {
        construct._super = superConstruct;
        return construct.prototype = Object.create(superConstruct.prototype, {
            constructor : {
                value : construct,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    };

    exports.getSuperConstructor = function(construct) {
        if(typeof construct === 'function') {
            return construct._super;
        }
        return null;
    };

});