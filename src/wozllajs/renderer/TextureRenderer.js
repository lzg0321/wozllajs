wozllajs.defineComponent('renderer.TextureRenderer', {

	extend : 'Renderer',

	alias : 'renderer.texture',

    image : null,

    currentFrame : null,

    src : null,

    frames : null,

    index : null,

    initComponent : function() {
        if(this.src) {
            this.image = this.getResourceById(this.src);
        }
        if(this.index === undefined) {
            this.index = 0;
        }
        if(this.frames) {
            this.currentFrame = this.frames[this.index];
        }
    },

    changeFrameIndex : function(index) {
        this.index = index;
        this.currentFrame = this.frames[index];
    },

    draw : function(context) {
        var w, h;
        var f = this.currentFrame;
        if(this.image && f) {
            w = f.w || f.width;
            h = f.h || f.height;
            context.drawImage(this.image, f.x, f.y, w, h, 0, 0, w, h);
        }
    },

    _collectResources : function(res) {
        if(this.src) {
            res.push(this.src);
        }
    }

});