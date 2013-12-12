define(function (require, exports, module) {

    var Arrays = require('../utils/Arrays');

    var AsyncImage = function(resourceId, image) {
		this.resourceId = resourceId;
        this.image = image;
        this.src = image && image.src;
    };

    var p = AsyncImage.prototype;

    p.draw = function(context, a, b, c, d, e, f, g, h) {
		// slice 性能差, 用最大参数数目优化
		//var args = Ext.Array.slice(arguments, 1);
		var image = this.image;
		var argsLen = arguments.length;
		if(image) {
			//args.unshift(image);
			//context.drawImage.apply(context, args);
			//console.log(a, b, c, d, e, f, g, h);
			if(argsLen === 3) {
				context.drawImage(image, a, b);
			} if(argsLen === 5) {
				context.drawImage(image, a, b, c, d);
			} if(argsLen === 7) {
				context.drawImage(image, a, b, c, d, e, f);
			} else {
				context.drawImage(image, a, b, c, d, e, f, g, h);
			}
		}
    };

    p.drawAs9Grid = function(context, region, grid, width, height) {
        if(!region || !grid || !width || !height) return;
        var rx = region.x;
        var ry = region.y;
        var ow = region.w;
        var oh = region.h;
        var gl = grid.left;
        var gr = grid.right;
        var gt = grid.top;
        var gb = grid.bottom;
        var ctx = context;

        // top left
        this.draw(context, rx, ry, gl, gt,
            0, 0, gl, gt);

        // top
        this.draw(context, rx + gl, ry + 0, ow- gl- gr, gt,
            gl, 0, width- gl- gr, gt);

        // top right
        this.draw(context, rx + ow- gr, ry + 0, gr, gt,
            width- gr, 0, gr, gt);

        // left
        this.draw(context, rx + 0, ry + gt, gl, oh - gt - gb,
            0, gt, gl, height - gt - gb);

        // left bottom
        this.draw(context, rx + 0, ry + oh - gb, gl, gb,
            0, height-gb, gl, gb);

        // bottom
        this.draw(context, rx + gl, ry + oh-gb, ow- gl- gr, gb,
            gl, height- gb, width- gl- gr, gb);

        // right bottom
        this.draw(context, rx + ow- gr, ry + oh - gb, gr, gb,
            width- gr, height-gb, gr, gb);

        // right
        this.draw(context, rx + ow- gr, ry + gt, gr, oh- gt -gb,
            width- gr, gt, gr, height- gt-gb);

        // center
        this.draw(context, rx + gl, ry + gt, ow- gl-gr, oh- gt -gb,
            gl, gt, width- gl- gr, height- gt-gb);
    };

	p.draw3in1 = function(context, region, splitCoords, widths) {
		if(!region || !splitCoords || !widths || splitCoords.length !== 2 || widths.length !== 3) return;
		var rx = region.x;
		var ry = region.y;
		var ow = region.w;
		var oh = region.h;

		this.draw(context,
			rx, ry, splitCoords[0], oh,
			0, 0, widths[0], oh);
		this.draw(context,
			rx+splitCoords[0], ry, splitCoords[1] - splitCoords[0], oh,
			widths[0], 0, widths[1], oh);
		this.draw(context,
			rx+splitCoords[1], ry, ow-splitCoords[1], oh,
			widths[0] + widths[1], 0, widths[2], oh);
	};

    p.dispose = function() {
        this.image && this.image.dispose && this.image.dispose();
        this.image = null;
    };

    module.exports = AsyncImage;

});