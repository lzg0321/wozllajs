define([], function() {

    /**
     * @param frames
     * @param frame.x
     * @param frame.y
     * @param frame.w
     * @param frame.h
     * @param frame.ox
     * @param frame.oy
     * @param asyncImage
     * @constructor
     */
    var Sprite = function(frames, asyncImage) {
        this.frames = frames;
        this.asyncImage = asyncImage;
    };

    Sprite.prototype = {
        draw : function(context, name, x, y, w, h) {
            var f = this.frames[name];
            if(f) {
                this.asyncImage.draw(context, f.x, f.y, f.w, f.h, (x||0)+(f.ox||0), (y||0)+(f.oy||0), w||f.w, h||f.h);
            }
        }
    };

    return Sprite;
});