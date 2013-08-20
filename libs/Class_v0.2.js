/**
 * @see http://github.com/zzm2q/Class
 */
(function() {

    var Debug = (function() {

        var that = {};

        that.autoPrint = true;

        var messages = [];

        messages.push = function(msg) {
            that.autoPrint && console.log(msg);
            Array.prototype.push.call(this, msg);
        };

        that.print = function() {
            for(var i=0; i<messages.length; i++) {
                console.log(messages[i].toString());
            }
        };

        that.error = function(msg) {
            messages.push("[Error] " + msg);
        };

        that.debug = function(msg) {
            messages.push("[Debug] " + msg);
        };

        that.warn = function(msg) {
            messages.push("[Warn]  " + msg);
        };

        return that;

    })();

    function Base() {
    }

    Base.prototype = {

        initialize : function(params) {
            for(var key in params) {
                this[key] = params[key];
            }
        },
        callParent : function(args) {
            var method = this.callParent.$caller || this.callParent.caller;
            var $class = method.$class;
            var $super = $class.$super;
            this.callParent.$caller = $super.prototype[method.$name];
            $super.prototype[method.$name].apply(this, args);
            delete this.callParent.$caller;
        }
    };

    var Class = (function() {

        var root = window;
        var that = {};

        function registerNamespace(namespace, target) {
            var NSList = namespace.split(".");
            var step = root;
            var k = null;
            while (k = NSList.shift()) {
                if (NSList.length) {
                    if (step[k] === undefined) {
                        step[k] = {};
                    }
                    step = step[k];
                } else {
                    if(step[k]) {
                        Debug.warn('The namespace "' + namespace + '" has been regsitered, override it.');
                    }
                    step[k] = target;
                }
            }
        }

        function getNamespace(namespace) {
            var NSList = namespace.split(".");
            var step = root;
            var k = null;
            while (k = NSList.shift()) {
                if (!step[k]) {
                    return null;
                }
                step = step[k];
            }
            return step;
        }

        that.definitionProcessorMap = {};

        /**
         * 定义一个class
         * @param className
         * @param definitions
         */
        that.define = function(className, definitions) {

            if(typeof definitions !== 'object') {
                Debug.error('definitions must be a object');
                return;
            }

            // process extend definition
            var extend = definitions.extend;
            delete definitions.extend;
            function Class() {
                Class.$super.call(this);
                for(var i= 0,len=Class.$initCalls.length; i<len; i++) {
                    Class.$initCalls[i].call(this);
                }
            }
            Class.$isClass = true;
            Class.$initCalls = [];
            if(extend) {
                Class.$super = that.getClass(extend);
                Class.prototype = Object.create(Class.$super.prototype);
            } else {
                Class.$super = Base;
                Class.prototype = new Base();
            }

            // process namespace
            Class.$className = className;
            Class.prototype.$className = className;
            Class.prototype.$class = Class;
            registerNamespace(className, Class);

            // process registered processor
            var definitionName;
            var definitionValue;
            var definitionProcessor;
            for(definitionName in definitions) {
                definitionValue = definitions[definitionName];
                definitionProcessor = that.definitionProcessorMap[definitionName];
                if(definitionProcessor) {
                    definitionProcessor(className, Class, definitions);
                    delete definitions[definitionName];
                }
            }

            // copy others definitions as fields of this class
            var fieldName;
            for(fieldName in definitions) {
                Class.prototype[fieldName] = definitions[fieldName];
                if(typeof Class.prototype[fieldName] === 'function') {
                    Class.prototype[fieldName].$class = Class;
                    Class.prototype[fieldName].$name = fieldName;
                }
            }

        };

        that.module = function(moduleName, module) {
            if(typeof module !== 'function') {
                Debug.error('module must be a function');
                return;
            }
            registerNamespace(moduleName, module);
            module.$isModule = true;
        };

        that.singleton = function(namespace, maker) {
            if(typeof maker !== 'function') {
                Debug.error('singleton maker must be a function');
                return;
            }
            registerNamespace(namespace, maker());
        };

        that.registerDefinitionProcessor = function(definitionName, processor) {
            that.definitionProcessorMap[definitionName] = processor;
        };

        that.getClass = function(className) {
            var constructor = getNamespace(className);
            if(constructor && constructor.$isClass) {
                return constructor;
            }
            Debug.warn('ClassNotFound: ' + className);
            return null;
        };

        that.getModule = function(moduleName) {
            var constructor = getNamespace(moduleName);
            if(constructor && constructor.$isModule) {
                return constructor;
            }
            Debug.warn('ModuleNotFound: ' + moduleName);
            return null;
        };

        that.create = function(className, args) {
            var constructor = that.getClass(className);
            var instance = new constructor();
            instance.initialize(args);
            return instance;
        };

        // register default processor
        that.registerDefinitionProcessor('statics', function(className, constructor, definitions) {
            var statics = definitions.statics;
            if(statics) {
                var staticProp;
                for(staticProp in statics) {
                    Object.defineProperty(constructor, staticProp, {
                        enumerable: true,
                        configurable: false,
                        writable: false,
                        value: statics[staticProp]
                    });
                    Object.defineProperty(constructor.prototype, staticProp, {
                        enumerable: false,
                        configurable: false,
                        writable: false,
                        value: statics[staticProp]
                    });
                }
            }
        });

        that.registerDefinitionProcessor('include', function(className, constructor, definitions) {
            var include = definitions.include;
            var module;
            var i, len;
            var proto = constructor.prototype;
            if(include) {
                if(Object.prototype.toString.call(include) !== '[object Array]') {
                    Debug.error('The value of include definition must be an array, class "' + className + '"');
                    return;
                }
                for(i=0, len=include.length; i<len; i++) {
                    module = (that.getModule(include[i]))(); // make module
                    if(module.initialize) {
                        constructor.$initCalls.push(module.initialize);
                        delete module.initialize;
                    }
                    for(var moduleProp in module) {
                        if(proto[moduleProp]) {
                            Debug.warn('Override once field "' + moduleProp + '" in class "' + className + '"');
                        }
                        proto[moduleProp] = module[moduleProp];
                    }
                }
            }
        });

        return that;

    })();

    window.Class = Class;
    window.Class.Debug = Debug;
    window.Class.Base = Base;

})();

