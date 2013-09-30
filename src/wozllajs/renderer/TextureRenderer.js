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
        var w, h, sw, sh;
        var f = this.currentFrame;
        if(this.image && f) {
            w = f.w || f.width;
            h = f.h || f.height;
            sw = f.sw === undefined ? w : f.sw;
            sh = f.sh === undefined ? h : f.sh;
            context.drawImage(this.image, f.x, f.y, sw, sh, 0, 0, sw, sh);
        }
    },

    _collectResources : function(res) {
        if(this.src) {
            res.push(this.src);
        }
    }

});