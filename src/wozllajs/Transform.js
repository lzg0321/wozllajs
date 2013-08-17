Class.module('wozlla.Transform', function() {

    var matrix = new createjs.Matrix2D();

    return {
        x : 0,
        y : 0,
        regX : 0,
        regY : 0,
        rotation : 0,
        scaleX : 1,
        scaleY : 1,
        skewX : 0,
        skewY : 0,
        alpha : 1,

        parent : null,

        getRoot : function() {
            var o = this;
            while(o.parent) {
                o = o.parent;
            }
            return o;
        },

        localToGlobal : function(x, y, mtx) {
            mtx = this.getConcatenatedMatrix(mtx);
            if (mtx == null) { return null; }
            mtx.append(1, 0, 0, 1, x, y);
            return { x : mtx.tx, y : mtx.ty };
        },

        globalToLocal : function(x, y, mtx) {
            mtx = this.getConcatenatedMatrix(mtx);
            if (mtx == null) { return null; }
            mtx.invert();
            mtx.append(1, 0, 0, 1, x, y);
            return { x : mtx.tx, y : mtx.ty };
        },

        getConcatenatedMatrix : function(mtx) {
            if (mtx) { mtx.identity(); }
            else { mtx = new createjs.Matrix2D(); }
            var o = this;
            while (o != null) {
                mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY)
                    .prependProperties(o.alpha);
                o = o.parent;
            }
            return mtx;
        },

        getMatrix : function(mtx) {
            var o = this;
            return (mtx ? mtx.identity() : new createjs.Matrix2D())
                .appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY)
                .appendProperties(o.alpha);
        },

        updateContext : function(context) {
            var mtx, o=this;
            mtx = matrix.identity().appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
            context.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            context.globalAlpha *= o.alpha;
        }
    }

});