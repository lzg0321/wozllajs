this.wozllajs = this.wozllajs || {};

this.wozllajs.LayerManager = (function() {

    var layerObjects = new wozllajs.Array2D(); // TODO 固定array2D
    var layers = {};
    var layerList = [];

    return {

        init : function(theLayers) {
            var name;
            layers = theLayers;
            for(name in theLayers) {
                layerList.push({
                    name : name,
                    z : theLayers[name]
                });
            }
            layerList.sort(function(a, b) {
                return b.z - a.z;
            });
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
            return layerObjects.get(layerId);
        },

        getSortedLayerList : function() {
            return layerList;
        }
    }

})();