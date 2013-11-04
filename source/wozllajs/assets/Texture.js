define([
    './../var',
    './../preload/AsyncImage'
], function(W, AsyncImage) {

    var Texture = function(image, frames) {
        AsyncImage.apply(this, arguments);
        this.frames = frames;
    };

    var p = W.inherits(Texture, AsyncImage);

    p.getFrame = function(name) {
        var frame;
        return (frame = this.frames[name]) && frame.frame || frame;
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


    return Texture;
});