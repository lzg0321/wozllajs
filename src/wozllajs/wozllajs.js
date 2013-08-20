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
            this.define(namespace, definition);
            componentMap[namespace] = namespace;
            componentMap[definition.alias] = namespace;
        },

        createComponent : function(name, params) {
            return this.create(componentMap[name], params);
        },

        createScene : function(id) {
            return this.create('wozlla.Scene', { id : id });
        },

        createGameObject : function(params) {
            return this.create('wozlla.GameObject', params);
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
        },

        singleSceneStartup : function(params) {
            var root = params.rootElement;
            root = typeof root === 'string' ? document.getElementById(root) : root;
            var engine = wozllajs.initEngine(root);
            var display = wozllajs.createDisplay('singleSceneDisplay', params.width, params.height, 0);
            var scene = wozllajs.createScene('singleScene');
            display.setScene(scene);
            engine.start();
            return scene;
        }
    };

})();