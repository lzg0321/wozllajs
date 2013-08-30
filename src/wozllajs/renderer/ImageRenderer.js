wozllajs.defineComponent('renderer.ImageRenderer', function() {

	var ImageRenderer = function(params) {
		this.initialize(params);
	};

	var p = ImageRenderer.prototype = Object.create(wozllajs.Renderer.prototype);

	p.id = 'renderer.ImageRenderer';

	p.alias = 'renderer.image';

    p.image = null;

    p.src = null;

    p.renderWidth = null;
    p.renderHeight = null;

    p.initComponent = function() {
        this.image = this.getResourceById(this.src);
        if(this.image && (!this.renderWidth || !this.renderHeight)) {
            this.renderWidth = this.image.width;
            this.renderHeight = this.image.height;
        }
    };

    p.draw = function(context, visibleRect) {
        if(this.image) {
            context.drawImage(this.image, 0, 0, this.renderWidth, this.renderHeight);
        }
    };

    p._collectResources = function(collection) {
        if(this.src) {
            collection.push(this.src);
        }
    };

    return ImageRenderer;

});