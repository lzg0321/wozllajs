wozllajs.defineComponent('renderer.JSONTextureRenderer', function() {

    var JSONTextureRenderer = function(params) {
        this.initialize(params);
    };

    var p = JSONTextureRenderer.prototype = Object.create(wozllajs.renderer.TextureRenderer.prototype);

    p.id = 'renderer.JSONTextureRenderer';

    p.alias = 'renderer.jsonTexture';

    p.texture = null;

    p.initComponent = function() {
        if(this.src) {
            this.image = this.getResourceById(this.src);
        }
        if(this.texture) {
            var ttData = this.getResourceById(this.texture);
            if(ttData) {
                this._applyData(ttData);
            }
        }
    };

    p._applyData = function(ttData) {
        this.frames = ttData.frames;
        this.currentFrame = this.frames[this.index];
    };

    p._collectResources = function(res) {
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
    };

    return JSONTextureRenderer;

});