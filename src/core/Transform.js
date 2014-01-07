define(function(require) {

    var Matrix2D = require('../math/Matrix2D');

    // 一个createjs类用于帮助从Transform到canvas的context中的transform参数
    var matrix = new Matrix2D();

	/**
	 * @class wozllajs.core.Transform
	 * @constructor
	 * @param params
	 * @param params.gameObject the gameobject of this transform
	 */
    var Transform = function(params) {
        this.x = 0;
        this.y = 0;
        this.regX = 0;
        this.regY = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.skewX = 0;
        this.skewY = 0;
        this.alpha = 1;
		this.relative = true;
        this.gameObject = params.gameObject;
    };

    Transform.prototype = {
        /**
         * Get the top parent of Transform
         * @return {*}
         */
        getRoot : function() {
            var o = this.gameObject;
            while(o && o._parent) {
                o = o._parent;
            }
            return o.transform;
        },

        /**
         * 将一个坐标点从相对于当前Transform转换成全局的坐标点
         * @param x
         * @param y
         * @return {*}
         */
        localToGlobal : function(x, y, concatenatedMatrix) {
            var mtx;
            if(concatenatedMatrix) {
                matrix.copy(concatenatedMatrix);
                mtx = matrix;
            } else {
                mtx = this.getConcatenatedMatrix();
            }
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
        globalToLocal : function(x, y, concatenatedMatrix) {
            var mtx;
            if(concatenatedMatrix) {
                matrix.copy(concatenatedMatrix);
                mtx = matrix;
            } else {
                mtx = this.getConcatenatedMatrix();
            }
            if (mtx == null) { return null; }
            mtx.invert();
            mtx.append(1, 0, 0, 1, x, y);
            return { x : mtx.tx, y : mtx.ty };
        },

        /**
         * 获取一个Matrix2D, 及联了所有它的parentTransform的属性, 通常很方便的用于转换坐标点
         * @return {createjs.Matrix2D}
         */
        getConcatenatedMatrix : function(resultMatrix) {
            var o = this;
            var mtx = resultMatrix || matrix;
            mtx.identity();
            while (o != null) {
                mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY)
                    .prependProperties(o.alpha);
				if(!o.relative) break;
                o = o.gameObject._parent;
				if(o) {
					o = o.transform;
				}
            }
            return mtx;
        },

        /**
         * 获取当前Transform转换的Matrix2D
         * @return {Matrix2D}
         */
        getMatrix : function() {
            var o = this;
            return matrix.identity()
                .appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY)
                .appendProperties(o.alpha);
        },

        /**
         * 将当前的Transform应用到canvas的context上
         * @param context CanvasContextRenderer2d
         */
        updateContext : function(context, optimized) {
            var mtx, o=this;
			if(this.relative) {
				if(optimized && this.isOnlyTranslate()) {
					context.translate(this.x, this.y);
				} else {
					context.save();
					mtx = matrix.identity().appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
					context.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
				}
				context.globalAlpha *= o.alpha;
			} else {
				context.save();
				mtx = this.getAbsoluteMatrix();
				context.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
				context.globalAlpha = o.alpha;
			}
        },

		reupdateContext : function(context, optimized) {
			if(this.relative && optimized && this.isOnlyTranslate()) {
				context.translate(-this.x, -this.y);
				context.globalAlpha /= this.alpha;
			} else {
				context.restore();
			}
		},

		isOnlyTranslate : function() {
			if( this.scaleX === 1 &&
				this.scaleY === 1 &&
				this.rotation === 0 &&
				this.regX === 0 &&
				this.regY === 0 &&
				this.skewX === 0 &&
				this.skewX === 0) {
				return true;
			}
			return false;
		},

		getAbsoluteMatrix : function(mtx) {
			var o = this;
			mtx = mtx || matrix;
			mtx.identity()
				.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY)
				.prependProperties(o.alpha);
			return mtx;
		},

        applyTransform : function(transform) {
            this.x = transform.x;
            this.y = transform.y;
            this.regX = transform.regX;
            this.regY = transform.regY;
            this.scaleX = transform.scaleX;
            this.scaleY = transform.scaleY;
            this.rotation = transform.rotation;
            this.alpha = transform.alpha;
            this.skewX = transform.skewX;
            this.skewY = transform.skewY;
        }
    };

    return Transform;

});