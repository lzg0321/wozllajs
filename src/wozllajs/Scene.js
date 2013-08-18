Class.define('wozlla.Scene', {

    extend : 'wozlla.GameObject',

    isScene : true,

    initialize : function() {
        this.callParent(arguments);
        if(!this.id) {
            this.id = 'Scene_' + Date.now() + Math.random();
        }
    }

});