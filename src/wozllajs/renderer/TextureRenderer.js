wozllajs.defineComponent('renderer.TextureRenderer', function() {

	var TextureRenderer = function(params) {
		this.initialize(params);
	};

	var p = TextureRenderer.prototype = Object.create(wozllajs.Renderer.prototype);

	p.id = 'renderer.TextureRenderer';

	p.alias = 'renderer.texture';

    p.image = null;

    p.currentFrame = null;

    p.src = null;

    p.frames = null;

    p.index = null;

    p.initComponent = function() {
        if(this.src) {
            this.image = this.getResourceById(this.src);
        }
        if(this.index === undefined) {
            this.index = 0;
        }
        if(this.frames) {
            this.currentFrame = this.frames[this.index];
        }
    };

    p.draw = function(context) {
        var w, h;
        var f = this.currentFrame;
        if(this.image && f) {
            w = f.w || f.width;
            h = f.h || f.height;
            context.drawImage(this.image, f.x, f.y, w, h, 0, 0, w, h);
        }
    };

    p._collectResources = function(res) {
        if(this.src) {
            res.push(this.src);
        }
    };

    return TextureRenderer;

});