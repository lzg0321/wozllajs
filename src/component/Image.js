define(function(require, exports, module) {
	var Objects = require('../utils/Objects');
	var Component = require('../core/Component');
	var Renderer = require('../core/Renderer');


	function Image() {
		Renderer.apply(this, arguments);
		this.image = undefined;
	}

	var p = Objects.inherits(Image, Renderer);

	p.id = 'Image';

	p.alias = 'c-Image';

	p.initComponent = function() {
		var me = this;
		me.applyProperties();
	};

	p.applyProperties = function(){
		var me = this;
		var src = me.properties.imageSrc;
		if(src) {
			me.loadResource(src).then(function() {
				me.image = me.getResource(src);
			});
		}
		me.baseline = me.properties.baseline;
		me.align = me.properties.align;
	};

	p.destroyComponent = function() {
		this.image && this.unloadResource(this.image.resourceId);
		this.image = null;
	};

	p.draw = function(context, visibleRect) {
		if(this.image){
			if(!(this.baseline || this.align))this.image.draw(context, 0, 0);
			else{
				var height = this.image.image.height;
				var width = this.image.image.width;
				var x, y;
				if(this.baseline == 'top') y = 0;
				else if(this.baseline == 'middle') y = -height/2;
				else if(this.baseline == 'bottom') y = -height;
				else y = 0;

				if(this.align == 'start') x = 0;
				else if(this.align == 'center') x = -width/2;
				else if(this.align == 'end') x = -width;
				else x = 0;

				this.image.draw(context, x, y);
			}
		}
	};

	p.isPreparedToDraw = function() {
		return !!this.image;
	};

	p.getTextureDescription = function() {
		return {
			left : 0,
			top : 0,
			right : this.image.image.width,
			bottom : this.image.image.height,
			texture : this.image.glTexture
		}
	};

	Component.register(Image);

	return Image;

});