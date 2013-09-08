wozllajs.defineComponent('renderer.ImageRenderer', {

    extend : 'Renderer',

	alias : 'renderer.image',

    image : null,

    src : null,

    sourceX : null,
    sourceY : null,
    sourceW : null,
    sourceH : null,
    renderWidth : null,
    renderHeight : null,

    initComponent : function() {
        var stage = this.gameObject.getStage();
        this.image = this.getResourceById(this.src);
        if(this.image) {
            if(!this.renderWidth || !this.renderHeight) {
                this.renderWidth = this.image.width;
                this.renderHeight = this.image.height;
            }
            if(undefined === this.sourceX || undefined === this.sourceY || !this.sourceW || !this.sourceH) {
                this.sourceX = 0;
                this.sourceY = 0;
                this.sourceW = this.image.width;
                this.sourceH = this.image.height;
            }
            this.renderWidth = wozllajs.SizeParser.parse(this.renderWidth, stage);
            this.renderHeight = wozllajs.SizeParser.parse(this.renderHeight, stage);
        }
    },

    draw : function(context, visibleRect) {
        if(this.image) {
            context.drawImage(this.image,
                this.sourceX, this.sourceY, this.sourceW, this.sourceH,
                0, 0, this.renderWidth, this.renderHeight);
        }
    },

    _collectResources : function(collection) {
        if(this.src) {
            collection.push(this.src);
        }
    }

});