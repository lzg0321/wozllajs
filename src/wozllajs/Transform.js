/**
 * Transform模块定义一个对象的位置、旋转、缩放。概括地说就是变型。
 * Transform通过parent指向父Transform, 因此Transform是
 * 树状结构中的一个节点
 *
 * @class {wozlla.Transform}
 */

wozllajs.module('wozlla.Transform', function() {

    // 一个类用于帮助从Transform到canvas的context中的transform参数
    var matrix = new createjs.Matrix2D();

    return {

        /**
         * The position of the Transform,
         */
        x : 0,
        y : 0,

        /**
         * The left/top offset for this Transform's registration point.
         **/
        regX : 0,
        regY : 0,

        /**
         * The rotation in degrees for this display object.
         */
        rotation : 0,

        /**
         * The scale for this Transform，1 is normal scale, 0 is invisible
         */
        scaleX : 1,
        scaleY : 1,

        /**
         * The factor to skew this display object horizontally/vertically.
         **/
        skewX : 0,
        skewY : 0,

        /**
         * The alpha (transparency) for this Transform. 0 is fully transparent, 1 is fully opaque.
         */
        alpha : 1,

        /**
         * The parent Transform of this Transform
         * @field {wozlla.Transform}
         */
        parent : null,

        /**
         * Get the top parent of Transform
         * @return {*}
         */
        getRoot : function() {
            var o = this;
            while(o.parent) {
                o = o.parent;
            }
            return o;
        },

        /**
         * 将一个坐标点从相对于当前Transform转换成全局的坐标点
         * @param x
         * @param y
         * @return {*}
         */
        localToGlobal : function(x, y) {
            var mtx = this.getConcatenatedMatrix();
            if (mtx == null) { return null; }
            mtx.append(1, 0, 0, 1, x, y);
            return { x : mtx.tx, y : mtx.ty };
        },

        /**
         * 与localToGlobal相反
         * @param x
         * @param y
         * @return {*}
         */
        globalToLocal : function(x, y) {
            var mtx = this.getConcatenatedMatrix();
            if (mtx == null) { return null; }
            mtx.invert();
            mtx.append(1, 0, 0, 1, x, y);
            return { x : mtx.tx, y : mtx.ty };
        },

        /**
         * 获取一个Matrix2D, 及联了所有它的parentTransform的属性, 通常很方便的用于转换坐标点
         * @return {createjs.Matrix2D}
         */
        getConcatenatedMatrix : function() {
            var o = this;
            while (o != null) {
                matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY)
                    .prependProperties(o.alpha);
                o = o.parent;
            }
            return matrix;
        },

        /**
         * 获取当前Transform转换的Matrix2D
         * @return {Matrix2D}
         */
        getMatrix : function() {
            var o = this;
            return matrix
                .appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY)
                .appendProperties(o.alpha);
        },

        /**
         * 将当前的Transform应用到canvas的context上
         * @param context CanvasContextRenderer2d
         */
        updateContext : function(context) {
            var mtx, o=this;
            mtx = matrix.identity().appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
            context.transform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            context.globalAlpha *= o.alpha;
        }
    }

});