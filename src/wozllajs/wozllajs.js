var wozllajs = (function() {

    var rootElement;

    var engine;

    var componentMap = {};

    return {

        define : Class.define,

        module : Class.module,

        create : Class.create,

        singleton : Class.singleton,

        defineComponent : function(namespace, definition) {
            var alias = definition.alias;
            delete definition.alias;
            this.define(namespace, definition);
            componentMap[namespace] = namespace;
            componentMap[alias] = namespace;
        },

        createComponent : function(name, params) {
            return this.create(componentMap[name], params);
        },

        initEngine : function(element) {
            if(element) {
                element.style.position = 'relative';
            }
            rootElement = element || document.body;
            engine = wozlla.Engine();
            return engine;
        },

        getEngine : function() {
            return engine;
        },

        createDisplay : function(id, width, height, zIndex) {
            var display = Class.create('wozlla.Display', {
                id : id,
                width : width || window.innerWidth,
                height : height || window.innerHeight,
                zIndex : zIndex
            });
            rootElement.appendChild(display.canvas);
            return display;
        }
    }

})();