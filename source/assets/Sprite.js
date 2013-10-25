define([], function() {

    /**
     * @param frames
     * @param frame.x
     * @param frame.y
     * @param frame.w
     * @param frame.h
     * @param frame.ox
     * @param frame.oy
     * @param image
     * @constructor
     */
    var Sprite = function(frames, image) {
        this.frames = frames;
        this.image = image;
    };

    Sprite.prototype = {
        draw : function(context, name, x, y, w, h) {
            var f = this.frames[name];
            if(f) {
                this.image.draw(context, f.x, f.y, f.w, f.h, (x||0)+(f.ox||0), (y||0)+(f.oy||0), w||f.w, h||f.h);
            }
        }
    };

    return Sprite;
});