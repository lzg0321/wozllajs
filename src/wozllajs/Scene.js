Class.define('wozlla.Scene', {

    extend : 'wozlla.GameObject',

    isScene : true,

    backgroundColor : null,

    initialize : function() {
        this.callParent(arguments);
        if(!this.id) {
            this.id = 'Scene_' + Date.now() + Math.random();
        }
    }

});