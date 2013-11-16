define(function (require, exports, module) {

    var Arrays = require('../utils/Arrays');

    var AsyncImage = function(image) {
        this.image = image;
        this.src = image && image.src;
    };

    var p = AsyncImage.prototype;

    p.draw = function(context) {
        // TODO optimize performance for slice and unshift
        var args = Arrays.slice(arguments, 1);
        var image = this.image;
        if(image) {
            args.unshift(image);
            context.drawImage.apply(context, args);
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

    p.dispose = function() {
        this.image && this.image.dispose && this.image.dispose();
        this.image = null;
    };

    module.exports = AsyncImage;

});