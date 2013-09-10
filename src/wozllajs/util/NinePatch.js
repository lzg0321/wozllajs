this.wozllajs = this.wozllajs || {};

(function() {

    function NinePatch(x, y, width, height, borders, originImage, region) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.borders = borders;
        this.originImage = originImage;
        this.region = region || {
            x: 0,
            y: 0,
            w: originImage.width,
            h: originImage.height
        };
        this.image = null;
    }

    NinePatch.prototype = {
        init : function() {
            var r = this.region;
            var b = this.borders;
            var oimg = this.originImage;
            var ow = r.w;
            var oh = r.h;
            var canvas = wozllajs.createCanvas(this.width, this.height);
            var ctx = canvas.getContext('2d');
            canvas.width = this.width;
            canvas.height = this.height;

            // top left
            ctx.drawImage(oimg, r.x, r.y, b.left, b.top,
                0, 0, b.left, b.top);

            // top
            ctx.drawImage(oimg, r.x + b.left, r.y + 0, ow- b.left- b.right, b.top,
                b.left, 0, this.width- b.left- b.right, b.top);

            // top right
            ctx.drawImage(oimg, r.x + ow- b.right, r.y + 0, b.right, b.top,
                this.width- b.right, 0, b.right, b.top);

            // left
            ctx.drawImage(oimg, r.x + 0, r.y + b.top, b.left, oh - b.top - b.bottom,
                0, b.top, b.left, this.height - b.top - b.bottom);

            // left bottom
            ctx.drawImage(oimg, r.x + 0, r.y + oh - b.bottom, b.left, b.bottom,
                0, this.height-b.bottom, b.left, b.bottom);

            // bottom
            ctx.drawImage(oimg, r.x + b.left, r.y + oh-b.bottom, ow- b.left- b.right, b.bottom,
                b.left, this.height- b.bottom, this.width- b.left- b.right, b.bottom);

            // right bottom
            ctx.drawImage(oimg, r.x + ow- b.right, r.y + oh - b.bottom, b.right, b.bottom,
                this.width- b.right, this.height-b.bottom, b.right, b.bottom);

            // right
            ctx.drawImage(oimg, r.x + ow- b.right, r.y + b.top, b.right, oh- b.top -b.bottom,
                this.width- b.right, b.top, b.right, this.height- b.top-b.bottom);

            // center
            ctx.drawImage(oimg, r.x + b.left, r.y + b.top, ow- b.left-b.right, oh- b.top -b.bottom,
                b.left, b.top, this.width- b.left- b.right, this.height- b.top-b.bottom);

            this.image = canvas;

        },
        dispose : function() {
            if(this.image && this.image.dispose) {
                this.image.dispose();
            }
        },
        draw : function(context) {
            context.drawImage(this.image, this.x, this.y);
        }
    };

    wozllajs.NinePatch = NinePatch;
})();