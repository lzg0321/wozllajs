Class.define('wozlla.Component', {

    id : null,

    gameObject : null,

    setGameObject : function(gameObject) {
        this.gameObject = gameObject;
    },

    getResources : function(res) {},

    init : function() {},

    destroy : function() {}

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