define(function (require, exports, module) {

    var Objects = require('../utils/Objects');
    var AsyncImage = require('./AsyncImage');

    var Texture = function(resourceId, image, frames) {
        AsyncImage.apply(this, arguments);
        this.frames = frames;
    };

    var p = Objects.inherits(Texture, AsyncImage);

    p.getFrame = function(name) {
        var frameData = this.frames[name];
        if(frameData) {
            return frameData.frame;
        }
        return null;
    };

    p.getSpriteSourceSize = function(name) {
        var frameData = this.frames[name];
        if(frameData) {
            return frameData.spriteSourceSize;
        }
        return null;
    };

    p.drawFrame = function(context, name, x, y, w, h) {
        var f = this.getFrame(name);
        if(f) {
            this.draw(context, f.x, f.y, f.w, f.h, x||0, y||0, w||f.w, h||f.h);
        }
    };

    p.drawFrameAs9Grid = function(context, name, grid, width, height) {
        var f = this.getFrame(name);
        if(f) {
            this.drawAs9Grid(context, f, grid, width, height);
        }
    };

	p.drawFrameAs3in1 = function(context, name, splitCoords, widths) {
		var f = this.getFrame(name);
		if(f) {
			this.draw3in1(context, f, splitCoords, widths);
		}
	}



    module.exports = Texture;

});