Class.define('wozlla.Component', {

    id : null,

    gameObject : null,

    setGameObject : function(gameObject) {
        this.gameObject = gameObject;
    },

    init : function() {},

    destroy : function() {},

    getResourceById : function(id) {
        return wozlla.ResourceManager.getResource(id);
    },

    /**
     * @param res
     * @private
     */
    _getResources : function(res) {}

    /**
     * @abstract
     */
    // update : function(camera) {},

    /**
     * @abstract
     */
    // lateUpdate : function(camera) {},

    /**
     * @abstract
     */
    // draw : function(context, cameraRect) {},


});