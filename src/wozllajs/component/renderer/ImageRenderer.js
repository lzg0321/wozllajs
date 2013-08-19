wozllajs.defineComponent('wozlla.component.renderer.ImageRenderer', {

    alias : 'image',

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
    },

    draw : function(context) {
        if(this.image) {
            if(this.renderWidth && this.renderHeight) {
                context.drawImage(this.image, 0, 0, this.renderWidth, this.renderHeight);
            } else {
                context.drawImage(this.image, 0, 0);
            }
        }
    },

    _getResources : function(res) {
        if(this.src) {
            res.push(this.src);
        }
    }

});