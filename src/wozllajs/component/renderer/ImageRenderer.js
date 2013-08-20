wozllajs.defineComponent('wozlla.component.renderer.ImageRenderer', {

    alias : 'renderer.image',

    natures : [
        wozlla.Component.NATURE_RENDER
    ],

    extend : 'wozlla.Component',

    image : null,

    src : null,

    renderWidth : null,
    renderHeight : null,

    initialize : function() {
        this.callParent(arguments);
    },

    init : function() {
        this.image = this.getResourceById(this.src);
        if(!this.renderWidth || !this.renderHeight) {
            this.renderWidth = this.image.width;
            this.renderHeight = this.image.height;
        }
    },

    draw : function(context) {
        if(this.image) {
            context.drawImage(this.image, 0, 0, this.renderWidth, this.renderHeight);
        }
    },

    _getResources : function(res) {
        if(this.src) {
            res.push(this.src);
        }
    }

});