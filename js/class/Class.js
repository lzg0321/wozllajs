/**
 *
 */
wozlla.Class = (function() {

    var _this = {};

    var root = wozlla;

    _this.define = function(className, definitions) {

        var i, len;

        var extend = definitions.extend;
        var mixins = definitions.mixins;
        var statics = definitions.statics;
        var superClass = extend ? _this.find(extend) : null;

        function Class() {
            superClass && superClass.apply(this, arguments);
            Class.prototype.initialize && Class.prototype.initialize.apply(this, arguments);
        }

        delete definitions.extend;
        delete definitions.mixins;
        delete definitions.statics;

        var NSList = className.split(".");
        var step = root;
        var k = null;
        while (k = NSList.shift()) {
            if (NSList.length) {
                if (step[k] === undefined) {
                    step[k] = {};
                }
                step = step[k];
            } else {
                if (!step[k]) {

                    step[k] = Class;

                }
            }
        }

        if(extend) {
            superClass = _this.find(extend);
            Class.prototype = Object.create(superClass.prototype);
            Class.prototype.__superClassName = extend;
            Class.prototype.__superClass = superClass;
        } else {
            Class.prototype = {};
        }

        Class.prototype.__className = className;

        // copy prototype
        for(var property in definitions) {
            Class.prototype[property] = definitions[property];
        }

        if(mixins) {
            var ignore = {
                '__className' : true,
                '__superClass' : true,
                '__superClassName' : true
            };
            var mixinClass;
            var mixinObject;
            var prop;
            for(i=0, len=mixins.length; i<len; i++) {
                mixinClass = _this.find(mixins[i]);
                mixinObject = new mixinClass();
                for(prop in mixinObject) {
                    if(ignore[prop]) continue;
                    if(Class.prototype[prop]) {
                        console.log('[Warn] property "' + prop + '" of class "' + className + '" has been override');
                    }
                    Class.prototype[prop] = mixinObject[prop];
                }
            }
            Class.prototype.__mixins = mixins;
        }


        if(statics) {
            var staticProp;
            for(staticProp in statics) {
                Class[staticProp] = statics[staticProp];
                Object.defineProperty(Class.prototype, staticProp, {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: statics[staticProp]
                });
            }
        }

    };

    _this.find = function(className) {
        var NSList = className.split(".");
        var step = root;
        var k = null;
        while (k = NSList.shift()) {
            if (!step[k]) {
                throw new Error("ClassNotFound: '" + className + "'");
            }
            step = step[k];
        }
        return step;
    };

    _this.create = function(className) {
        var NSList = className.split(".");
        var step = root;
        var k = null;
        while (k = NSList.shift()) {
            if (!step[k]) {
                throw new Error("ClassNotFound: '" + className + "'");
            }
            step = step[k];
        }
        // 我相信没人会创建一个超过6个构造参数的类
        return new step(
            arguments[1],
            arguments[2],
            arguments[3],
            arguments[4],
            arguments[5],
            arguments[6] );
    };

    return _this;

})();

/**
 * register short name
 */
wozlla.define = wozlla.Class.define;
wozlla.create = wozlla.Class.create;