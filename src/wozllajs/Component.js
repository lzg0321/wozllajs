Class.define('wozlla.Component', {

    id : null,

    gameObject : null,

    setGameObject : function(gameObject) {
        this.gameObject = gameObject;
    },

    init : function() {},

    destroy : function() {}

    /**
     *
     * @abstract
     *
     */
    // update : function(camera) {},

    /**
     * @abstract
     */
    // draw : function(context, cameraRect) {},


});