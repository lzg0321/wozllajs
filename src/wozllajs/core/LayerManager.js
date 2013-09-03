this.wozllajs = this.wozllajs || {};

this.wozllajs.LayerManager = (function() {

    var layerObjects = new wozllajs.Array2D(); // TODO 固定array2D
    var layers = null;

    return {

        init : function(theLayers) {
            layers = theLayers;
        },

        appendTo : function(layerId, gameObject) {
            layerObjects.push(layerId, gameObject);
        },

        removeFrom : function(layerId, gameObject) {
            layerObjects.remove(layerId, gameObject);
        },

        getLayerZ : function(layerId) {
            return layers[layerId];
        },

        getLayerObjects : function(layerId) {
            return [].concat(layerObjects.get(layerId));
        }
    }

})();