wozllajs.defineComponent('renderer.TextureButton', {

    extend : 'renderer.JSONTextureRenderer',

    alias : 'renderer.textureButton',

    normalIndex : null,

    pressIndex : null,

    handler : null,

    initComponent : function() {
        var me = this;
        me.JSONTextureRenderer_initComponent();
        if(me.frames) {
            me.currentFrame = me.frames[me.normalIndex];
            me.on('touchstart', function(e) {
                console.log('touchstart');
                me.currentFrame = me.frames[me.pressIndex];
            });
            me.on('touchend', function(e) {
                console.log('touchend');
                me.currentFrame = me.frames[me.normalIndex];
            });
            me.on('click', function(e) {
                console.log('click');
            });
        }
    }

});