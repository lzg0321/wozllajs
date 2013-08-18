var wozllajs = (function() {

    var rootElement;

    var engine;

    return {

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