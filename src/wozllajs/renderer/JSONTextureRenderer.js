wozllajs.defineComponent('renderer.JSONTextureRenderer', {

    extend : 'renderer.TextureRenderer',

    alias : 'renderer.jsonTexture',

    texture : null,

    initComponent : function() {
        if(this.src) {
            this.image = this.getResourceById(this.src);
        }
        if(this.texture) {
            var ttData = this.getResourceById(this.texture);
            if(ttData) {
                this._applyData(ttData);
            }
        }
    },

    _applyData : function(ttData) {
        this.frames = ttData.frames;
        this.currentFrame = this.frames[this.index];
    },

    _collectResources : function(res) {
        if(this.texture) {
            res.push({
                id : this.texture,
                src  : this.texture,
                type : 'json'
            });
            if(!this.src) {
                this.src = this.texture + '.png';
            }
        }
        if(this.src) {
            res.push(this.src);
        }
    }

});