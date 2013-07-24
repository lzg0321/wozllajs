WozllaJS.define('Transform', function($) {

    function Transform() {
        $.Component.call(this);

        this.matrix = new $.Matrix2D();
    }

    Transform.prototype = $.extend($.Component, {

        type : 'Transform',

        x : 0,

        y : 0,

        regX : 0,

        regY : 0,

        rotation : 0,

        scaleX : 1,

        scaleY : 1,

        skewX : 0,

        skewY : 0,

        translate : function(x, y) {
            this.x += x;
            this.y += y;
        },

        scale : function() {

        },

        rotate : function() {

        },

        applyToContext : function(context) {
            var mtx, o=this;
            mtx = o.matrix.identity().appendTransform(
                o.x, o.y, o.scaleX, o.scaleY, o.rotation,
                o.skewX, o.skewY, o.regX, o.regY);
            context.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
        }

    });

    return Transform;

});