this.wozllajs = this.wozllajs || {};

(function() {
    function RepeatImage(x, y, width, height, repeat, originImage) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.repeat = repeat;
        this.originImage = originImage;
        this.image = null;
    }

    RepeatImage.prototype = {

        init : function(type) {
            var canvas = wozllajs.createCanvas(this.width, this.height);
            var ctx = canvas.getContext('2d');
            var i;
            canvas.width = this.width;
            canvas.height = this.height;

            if(this.repeat === RepeatImage.REPEAT_X) {
                if(type === RepeatImage.SCALE) {
                    ctx.drawImage(this.originImage, 0, 0,
                        this.originImage.width, this.originImage.height,
                        0, 0, this.width, this.height);
                } else if(type === RepeatImage.TILE) {
                    for(i=0; i<this.width; i+=this.originImage.width) {
                        ctx.drawImage(this.originImage, i, 0);
                    }
                }
            } else if(this.repeat === RepeatImage.REPEAT_Y) {
                // TODO repeat y
            }

            this.image = canvas;
        },
        dispose : function() {
            if(this.image.dispose) {
                this.image.dispose();
            }
        },
        draw : function(context) {
            context.drawImage(this.image, this.x, this.y);
        }

    };

    RepeatImage.REPEAT_X = 1;
    RepeatImage.REPEAT_Y = 2;

    RepeatImage.SCALE = 3;
    RepeatImage.TILE = 4;

    wozllajs.RepeatImage = RepeatImage;
})();