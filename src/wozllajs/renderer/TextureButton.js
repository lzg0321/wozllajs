wozllajs.defineComponent('renderer.TextureButton', {

    extend : 'renderer.JSONTextureRenderer',

    alias : 'renderer.textureButton',

    normalIndex : null,

    pressIndex : null,

    name : 'Undefined',

    initComponent : function() {
        this.JSONTextureRenderer_initComponent();
        if(this.frames) {
            this.currentFrame = this.frames[this.normalIndex];
            this.on('touchstart', this.onTouchStart, this);
            this.on('touchend', this.onTouchEnd, this);
            this.on('click', this.onClick, this);
        }
    },

    onTouchStart : function() {
        this.currentFrame = this.frames[this.pressIndex];
    },

    onTouchEnd : function() {
        this.currentFrame = this.frames[this.normalIndex];
    },
    onClick : function() {
        wozllajs.EventAdmin.notify(this.name + '.click');
    },

    destroyComponent : function() {
        this.off('touchstart', this.onTouchStart, this);
        this.off('touchend', this.onTouchEnd, this);
        this.off('click', this.onClick, this);
    }

});