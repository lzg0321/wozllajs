
define('wozllajs/var/isArray',[],function() {

    var toString = Object.prototype.toString;

    return function(testObj) {
        return toString.call(testObj) === '[object Array]';
    };

});
define('wozllajs/var/isImage',[],function() {

    var toString = Object.prototype.toString;

    return function(testObj) {
        var str = toString.call(testObj);
        return str === '[object Image]' || str === '[object HTMLImageElement]';
    };

});
define('wozllajs/var/inherits',[],function() {

    return function(construct, superConstruct) {
        construct._super = superConstruct;
        return construct.prototype = Object.create(superConstruct.prototype, {
            constructor : {
                value : construct,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    }
});
define('wozllajs/var/uniqueKey',[],function() {

    var uniqueKeyIncrementor = 1;

    return function() {
        return uniqueKeyIncrementor++;
    };
});
define('wozllajs/var/slice',[],function() {

    return function(argsObj) {
        var ags = Array.prototype.slice.apply(arguments, [1]);
        return Array.prototype.slice.apply(argsObj, ags);
    };

});
define('wozllajs/var/createCanvas',[],function() {

    return function(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };

});
define('wozllajs/var/support',[],function() {

    return {
        touch : 'ontouchstart' in window
    }
});
define('wozllajs/var/getSuperConstructor',[],function() {

    return function(construct) {
        if(typeof construct === 'function') {
            return construct._super;
        }
        return null;
    }
});
define('wozllajs/globals',[],function() {

    return {
        METHOD_UPDATE : 'update',
        METHOD_LATE_UPDATE : 'lateUpdate',
        METHOD_DRAW : 'draw',
        METHOD_INIT_COMPONENT : 'initComponent',
        METHOD_DESTROY_COMPONENT : 'destroyComponent'
    }
});
define('wozllajs/var',[
    './var/isArray',
    './../wozllajs/var/isImage',
    './../wozllajs/var/inherits',
    './../wozllajs/var/uniqueKey',
    './../wozllajs/var/slice',
    './../wozllajs/var/createCanvas',
    './../wozllajs/var/support',
    './../wozllajs/var/getSuperConstructor',
    './globals'
], function(isArray, isImage, inherits, uniqueKey, slice, createCanvas, support, getSuperConstructor, globals) {

    var vars = {
        isArray : isArray,
        isImage : isImage,
        inherits : inherits,
        uniqueKey : uniqueKey,
        slice : slice,
        createCanvas : createCanvas,
        support : support,
        getSuperConstructor : getSuperConstructor
    };

    for(var i in globals) {
        vars[i] = globals[i];
    }

    return vars;
});

define('wozllajs/promise',[
    './var'
], function(W){

    var Promise = function() {
        this._thenQueue = [];
        this._errorQueue = [];
    };

    Promise.wait = function(promises) {
        var i, len;
        var p = new Promise();
        var doneNum = 0;
        var result = [];
        if(arguments.length === 1) {
            if(!W.isArray(promises)) {
                promises = [promises];
            }
        } else {
            promises = W.slice(arguments);
        }
        for(i=0,len=promises.length; i<len; i++) {
            (function(idx, promiseLen) {
                promises[idx].then(function(r) {
                    doneNum ++;
                    r = arguments.length > 1 ? W.slice(arguments) : r;
                    result[idx] = r;
                    if(doneNum === promiseLen) {
                        p.done.apply(p, result);
                    }
                    return r;
                });
            })(i, len);
        }
        return p;
    };

    var p = Promise.prototype;

    p.then = function(callback, context) {
        this._thenQueue.push({
            callback : callback,
            context : context
        });
        return this;
    };

    p.catchError = function(callback, context) {
        this._errorQueue.push({
            callback : callback,
            context : context
        });
        return this;
    };

    p.done = function() {
        var me = this;
        var args = arguments;
        setTimeout(function() {
            me._nextThen.apply(me, args);
        }, 1);
        return this;
    };

    p.sendError = function(error) {
        var me = this;
        setTimeout(function() {
            me._nextError(error);
        }, 1);
        return this;
    };

    p._nextThen = function() {
        var then = this._thenQueue.shift();
        if(then) {
            var args = then.callback.apply(then.context || this, arguments);
            args = W.isArray(args) ? args : [args];
            this._nextThen.apply(this, args);
        }
    };

    p._nextError = function() {
        var error = this._errorQueue.shift();
        if(error) {
            var args = error.callback.apply(error.context || this, arguments);
            args = W.isArray(args) ? args : [args];
            this._nextError.apply(this, args);
        }
    };

    return Promise;

});
/**
 * Copy from createjs
 * @see createjs.com
 */

define('wozllajs/math/Matrix2D',[],function() {

    /**
     * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrixes.
     * @class Matrix2D
     * @param {Number} [a=1] Specifies the a property for the new matrix.
     * @param {Number} [b=0] Specifies the b property for the new matrix.
     * @param {Number} [c=0] Specifies the c property for the new matrix.
     * @param {Number} [d=1] Specifies the d property for the new matrix.
     * @param {Number} [tx=0] Specifies the tx property for the new matrix.
     * @param {Number} [ty=0] Specifies the ty property for the new matrix.
     * @constructor
     **/
    var Matrix2D = function(a, b, c, d, tx, ty) {
        this.initialize(a, b, c, d, tx, ty);
    };

    var p = Matrix2D.prototype;

// static public properties:

    /**
     * An identity matrix, representing a null transformation.
     * @property identity
     * @static
     * @type Matrix2D
     * @readonly
     **/
    Matrix2D.identity = null; // set at bottom of class definition.

    /**
     * Multiplier for converting degrees to radians. Used internally by Matrix2D.
     * @property DEG_TO_RAD
     * @static
     * @final
     * @type Number
     * @readonly
     **/
    Matrix2D.DEG_TO_RAD = Math.PI/180;


// public properties:
    /**
     * Position (0, 0) in a 3x3 affine transformation matrix.
     * @property a
     * @type Number
     **/
    p.a = 1;

    /**
     * Position (0, 1) in a 3x3 affine transformation matrix.
     * @property b
     * @type Number
     **/
    p.b = 0;

    /**
     * Position (1, 0) in a 3x3 affine transformation matrix.
     * @property c
     * @type Number
     **/
    p.c = 0;

    /**
     * Position (1, 1) in a 3x3 affine transformation matrix.
     * @property d
     * @type Number
     **/
    p.d = 1;

    /**
     * Position (2, 0) in a 3x3 affine transformation matrix.
     * @property tx
     * @type Number
     **/
    p.tx = 0;

    /**
     * Position (2, 1) in a 3x3 affine transformation matrix.
     * @property ty
     * @type Number
     **/
    p.ty = 0;

    /**
     * Property representing the alpha that will be applied to a display object. This is not part of matrix
     * operations, but is used for operations like getConcatenatedMatrix to provide concatenated alpha values.
     * @property alpha
     * @type Number
     **/
    p.alpha = 1;

    /**
     * Property representing the shadow that will be applied to a display object. This is not part of matrix
     * operations, but is used for operations like getConcatenatedMatrix to provide concatenated shadow values.
     * @property shadow
     * @type Shadow
     **/
    p.shadow  = null;

    /**
     * Property representing the compositeOperation that will be applied to a display object. This is not part of
     * matrix operations, but is used for operations like getConcatenatedMatrix to provide concatenated
     * compositeOperation values. You can find a list of valid composite operations at:
     * <a href="https://developer.mozilla.org/en/Canvas_tutorial/Compositing">https://developer.mozilla.org/en/Canvas_tutorial/Compositing</a>
     * @property compositeOperation
     * @type String
     **/
    p.compositeOperation = null;

// constructor:
    /**
     * Initialization method. Can also be used to reinitialize the instance.
     * @method initialize
     * @param {Number} [a=1] Specifies the a property for the new matrix.
     * @param {Number} [b=0] Specifies the b property for the new matrix.
     * @param {Number} [c=0] Specifies the c property for the new matrix.
     * @param {Number} [d=1] Specifies the d property for the new matrix.
     * @param {Number} [tx=0] Specifies the tx property for the new matrix.
     * @param {Number} [ty=0] Specifies the ty property for the new matrix.
     * @return {Matrix2D} This instance. Useful for chaining method calls.
     */
    p.initialize = function(a, b, c, d, tx, ty) {
        this.a = (a == null) ? 1 : a;
        this.b = b || 0;
        this.c = c || 0;
        this.d = (d == null) ? 1 : d;
        this.tx = tx || 0;
        this.ty = ty || 0;
        return this;
    };

// public methods:
    /**
     * Concatenates the specified matrix properties with this matrix. All parameters are required.
     * @method prepend
     * @param {Number} a
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} tx
     * @param {Number} ty
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.prepend = function(a, b, c, d, tx, ty) {
        var tx1 = this.tx;
        if (a != 1 || b != 0 || c != 0 || d != 1) {
            var a1 = this.a;
            var c1 = this.c;
            this.a  = a1*a+this.b*c;
            this.b  = a1*b+this.b*d;
            this.c  = c1*a+this.d*c;
            this.d  = c1*b+this.d*d;
        }
        this.tx = tx1*a+this.ty*c+tx;
        this.ty = tx1*b+this.ty*d+ty;
        return this;
    };

    /**
     * Appends the specified matrix properties with this matrix. All parameters are required.
     * @method append
     * @param {Number} a
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} tx
     * @param {Number} ty
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.append = function(a, b, c, d, tx, ty) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;

        this.a  = a*a1+b*c1;
        this.b  = a*b1+b*d1;
        this.c  = c*a1+d*c1;
        this.d  = c*b1+d*d1;
        this.tx = tx*a1+ty*c1+this.tx;
        this.ty = tx*b1+ty*d1+this.ty;
        return this;
    };

    /**
     * Prepends the specified matrix with this matrix.
     * @method prependMatrix
     * @param {Matrix2D} matrix
     **/
    p.prependMatrix = function(matrix) {
        this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        this.prependProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
        return this;
    };

    /**
     * Appends the specified matrix with this matrix.
     * @method appendMatrix
     * @param {Matrix2D} matrix
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.appendMatrix = function(matrix) {
        this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        this.appendProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
        return this;
    };

    /**
     * Generates matrix properties from the specified display object transform properties, and prepends them with this matrix.
     * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2D();
     * mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
     * @method prependTransform
     * @param {Number} x
     * @param {Number} y
     * @param {Number} scaleX
     * @param {Number} scaleY
     * @param {Number} rotation
     * @param {Number} skewX
     * @param {Number} skewY
     * @param {Number} regX Optional.
     * @param {Number} regY Optional.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        if (rotation%360) {
            var r = rotation*Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }

        if (regX || regY) {
            // append the registration offset:
            this.tx -= regX; this.ty -= regY;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single prepend operation?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
            this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        } else {
            this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
        }
        return this;
    };

    /**
     * Generates matrix properties from the specified display object transform properties, and appends them with this matrix.
     * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix2D();
     * mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
     * @method appendTransform
     * @param {Number} x
     * @param {Number} y
     * @param {Number} scaleX
     * @param {Number} scaleY
     * @param {Number} rotation
     * @param {Number} skewX
     * @param {Number} skewY
     * @param {Number} regX Optional.
     * @param {Number} regY Optional.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        if (rotation%360) {
            var r = rotation*Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }

        if (skewX || skewY) {
            // TODO: can this be combined into a single append?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
        } else {
            this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
        }

        if (regX || regY) {
            // prepend the registration offset:
            this.tx -= regX*this.a+regY*this.c;
            this.ty -= regX*this.b+regY*this.d;
        }
        return this;
    };

    /**
     * Applies a rotation transformation to the matrix.
     * @method rotate
     * @param {Number} angle The angle in radians. To use degrees, multiply by <code>Math.PI/180</code>.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.rotate = function(angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        var a1 = this.a;
        var c1 = this.c;
        var tx1 = this.tx;

        this.a = a1*cos-this.b*sin;
        this.b = a1*sin+this.b*cos;
        this.c = c1*cos-this.d*sin;
        this.d = c1*sin+this.d*cos;
        this.tx = tx1*cos-this.ty*sin;
        this.ty = tx1*sin+this.ty*cos;
        return this;
    };

    /**
     * Applies a skew transformation to the matrix.
     * @method skew
     * @param {Number} skewX The amount to skew horizontally in degrees.
     * @param {Number} skewY The amount to skew vertically in degrees.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.skew = function(skewX, skewY) {
        skewX = skewX*Matrix2D.DEG_TO_RAD;
        skewY = skewY*Matrix2D.DEG_TO_RAD;
        this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
        return this;
    };

    /**
     * Applies a scale transformation to the matrix.
     * @method scale
     * @param {Number} x The amount to scale horizontally
     * @param {Number} y The amount to scale vertically
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.scale = function(x, y) {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.tx *= x;
        this.ty *= y;
        return this;
    };

    /**
     * Translates the matrix on the x and y axes.
     * @method translate
     * @param {Number} x
     * @param {Number} y
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.translate = function(x, y) {
        this.tx += x;
        this.ty += y;
        return this;
    };

    /**
     * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
     * @method identity
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.identity = function() {
        this.alpha = this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        this.shadow = this.compositeOperation = null;
        return this;
    };

    /**
     * Inverts the matrix, causing it to perform the opposite transformation.
     * @method invert
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.invert = function() {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var tx1 = this.tx;
        var n = a1*d1-b1*c1;

        this.a = d1/n;
        this.b = -b1/n;
        this.c = -c1/n;
        this.d = a1/n;
        this.tx = (c1*this.ty-d1*tx1)/n;
        this.ty = -(a1*this.ty-b1*tx1)/n;
        return this;
    };

    /**
     * Returns true if the matrix is an identity matrix.
     * @method isIdentity
     * @return {Boolean}
     **/
    p.isIdentity = function() {
        return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
    };

    /**
     * Transforms a point according to this matrix.
     * @method transformPoint
     * @param {Number} x The x component of the point to transform.
     * @param {Number} y The y component of the point to transform.
     * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
     **/
    p.transformPoint = function(x, y, pt) {
        pt = pt||{};
        pt.x = x*this.a+y*this.c+this.tx;
        pt.y = x*this.b+y*this.d+this.ty;
        return pt;
    };

    /**
     * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that this these values
     * may not match the transform properties you used to generate the matrix, though they will produce the same visual
     * results.
     * @method decompose
     * @param {Object} target The object to apply the transform properties to. If null, then a new object will be returned.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.decompose = function(target) {
        // TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation
        // even when scale is negative
        if (target == null) { target = {}; }
        target.x = this.tx;
        target.y = this.ty;
        target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
        target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

        var skewX = Math.atan2(-this.c, this.d);
        var skewY = Math.atan2(this.b, this.a);

        if (skewX == skewY) {
            target.rotation = skewY/Matrix2D.DEG_TO_RAD;
            if (this.a < 0 && this.d >= 0) {
                target.rotation += (target.rotation <= 0) ? 180 : -180;
            }
            target.skewX = target.skewY = 0;
        } else {
            target.skewX = skewX/Matrix2D.DEG_TO_RAD;
            target.skewY = skewY/Matrix2D.DEG_TO_RAD;
        }
        return target;
    };

    /**
     * Reinitializes all matrix properties to those specified.
     * @method reinitialize
     * @param {Number} [a=1] Specifies the a property for the new matrix.
     * @param {Number} [b=0] Specifies the b property for the new matrix.
     * @param {Number} [c=0] Specifies the c property for the new matrix.
     * @param {Number} [d=1] Specifies the d property for the new matrix.
     * @param {Number} [tx=0] Specifies the tx property for the new matrix.
     * @param {Number} [ty=0] Specifies the ty property for the new matrix.
     * @param {Number} [alpha=1] desired alpha value
     * @param {Shadow} [shadow=null] desired shadow value
     * @param {String} [compositeOperation=null] desired composite operation value
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.reinitialize = function(a, b, c, d, tx, ty, alpha, shadow, compositeOperation) {
        this.initialize(a,b,c,d,tx,ty);
        this.alpha = alpha == null ? 1 : alpha;
        this.shadow = shadow;
        this.compositeOperation = compositeOperation;
        return this;
    };

    /**
     * Copies all properties from the specified matrix to this matrix.
     * @method copy
     * @param {Matrix2D} matrix The matrix to copy properties from.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.copy = function(matrix) {
        return this.reinitialize(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty, matrix.alpha, matrix.shadow, matrix.compositeOperation);
    };

    /**
     * Appends the specified visual properties to the current matrix.
     * @method appendProperties
     * @param {Number} alpha desired alpha value
     * @param {Shadow} shadow desired shadow value
     * @param {String} compositeOperation desired composite operation value
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.appendProperties = function(alpha, shadow, compositeOperation) {
        this.alpha *= alpha;
        this.shadow = shadow || this.shadow;
        this.compositeOperation = compositeOperation || this.compositeOperation;
        return this;
    };

    /**
     * Prepends the specified visual properties to the current matrix.
     * @method prependProperties
     * @param {Number} alpha desired alpha value
     * @param {Shadow} shadow desired shadow value
     * @param {String} compositeOperation desired composite operation value
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.prependProperties = function(alpha, shadow, compositeOperation) {
        this.alpha *= alpha;
        this.shadow = this.shadow || shadow;
        this.compositeOperation = this.compositeOperation || compositeOperation;
        return this;
    };

    /**
     * Returns a clone of the Matrix2D instance.
     * @method clone
     * @return {Matrix2D} a clone of the Matrix2D instance.
     **/
    p.clone = function() {
        return (new Matrix2D()).copy(this);
    };

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    p.toString = function() {
        return "[Matrix2D (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]";
    };

    // this has to be populated after the class is defined:
    Matrix2D.identity = new Matrix2D();

    return Matrix2D;

});
define('wozllajs/math/Point',[],function() {

    function Point(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    return Point;
});



define('wozllajs/math',[
    './math/Matrix2D',
    './../wozllajs/math/Point'
], function(Matrix2D, Point) {

    return {
        Matrix2D : Matrix2D,
        Point : Point
    }
});
define('wozllajs/util/Tuple',[],function() {

    var Tuple = function() {
        this.data = {};
    };

    Tuple.prototype = {
        push : function(key, val) {
            this.data[key] = this.data[key] || [];
            this.data[key].push(val);
        },
        get : function(key) {
            if(key === undefined) {
                return this.data;
            }
            return this.data[key] || [];
        },
        sort : function(key, sorter) {
            this.data[key].sort(sorter);
            return this;
        },
        remove : function(key, val) {
            var idx, i, len;
            var array = this.data[key];
            if(!array) {
                return false;
            }
            for(i=0,len=array.length; i<len; i++) {
                if(array[i] === val) {
                    idx = i;
                    break;
                }
            }
            if(idx !== undefined) {
                array.splice(idx, 1);
                return true;
            }
            return false;
        },
        clear : function(key) {
            if(key) {
                this.data[key] = undefined;
            } else {
                this.data = {};
            }
        }
    };

    return Tuple;

});
define('wozllajs/annotation/AnnotationRegistry',[
    './../var/uniqueKey'
], function(uniqueKey) {

    var registry = {};

    function createId() {
        return '__module_annotation_' + uniqueKey()
    }

    function getModuleKey() {
        return '__module_annotation_key';
    }

    return {
        getAll : function($annoType) {
            var arr = [];
            var anno;
            for(var mKey in registry) {
                anno = registry[mKey];
                if(anno) {
                    arr = arr.concat(anno.getAnnotation($annoType));
                }
            }
            return arr;
        },
        get : function(module) {
            return registry[module[getModuleKey()]];
        },
        register : function(module, annotation) {
            var id = createId();
            registry[id] = annotation;
            module[getModuleKey()] = id;
        },
        unregister : function(module) {
            delete registry[module[getModuleKey()]];
        }
    }

});
define('wozllajs/annotation/Annotation',[
    './../var',
    './../util/Tuple',
    './AnnotationRegistry'
], function(W, Tuple, AnnotationRegistry) {

    var currentAnnotation;
    var annotationMap = {};

    function $Annotation(name, config, definition, $NamedAnnotation) {
        var prop, propValue, defineType;
        for(prop in config) {
            if(!definition[prop]) {
                throw new Error('Undefined property "' + prop + '" in ' + name);
            }
            propValue = config[prop];
            defineType = definition[prop].type;
            if(!propValue) {
                propValue = definition[prop].defaults;
            }
            else if(((typeof defineType) === 'string')) {
                if(((typeof propValue) !== defineType)) {
                    throw new Error('Type mismatch on property "' + prop + '" of ' + name);
                }
            }
            else if(propValue instanceof Object) {
                if(!(propValue instanceof definition[prop].type)) {
                    throw new Error('Type mismatch on property "' + prop + '" of ' + name);
                }
            }
            this[prop] = propValue;
        }
        currentAnnotation.addAnnotation($NamedAnnotation, this);
    }

    var Annotation = function() {
        this._$annotationTuple = new Tuple();
        this._empty = true;
        currentAnnotation = this;
    };

    Annotation.forModule = function(module) {
        var i, len;
        var theModule = module;
        var arr = [];
        while(theModule) {
            arr.unshift(theModule);
            theModule = W.getSuperConstructor(theModule);
        }
        var annotation = new Annotation();
        var mAnnotation;
        for(i=0,len=arr.length; i<len; i++) {
            mAnnotation = AnnotationRegistry.get(arr[i]);
            if(mAnnotation) {
                mAnnotation.forEach(function(type, $annos) {
                    var i, len;
                    type = annotationMap[type];
                    for(i=0,len=$annos.length; i<len; i++) {
                        annotation.addAnnotation(type, $annos[i]);
                    }
                });
            }
        }
        return annotation;
    };

    Annotation.define = function(name, definition) {
        var $NamedAnnotation = function(config) {
            if(typeof config !== 'object') {
                config = { value : config };
            }
            return new $Annotation(name, config, definition, $NamedAnnotation);
        };

        $NamedAnnotation.forModule = function(module) {
            return Annotation.forModule(module).getAnnotations($NamedAnnotation);
        };
        $NamedAnnotation.isPresent = function(module) {
            return Annotation.forModule(module).isAnnotationPresent($NamedAnnotation);
        };
        $NamedAnnotation.allModule = function() {
            return AnnotationRegistry.getAll($NamedAnnotation);
        };
        $NamedAnnotation._annotation_name = name;
        annotationMap[name] = $NamedAnnotation;
        // if export for global ?
        return $NamedAnnotation;
    };

    var p = Annotation.prototype;

    p.isEmpty = function() {
        return this._empty;
    };

    p.isAnnotationPresent = function(type) {
        return this._$annotationTuple.get(type._annotation_name).length > 0;
    };

    p.getAnnotation = function(type) {
        return this._$annotationTuple.get(type._annotation_name)[0];
    };

    p.getAnnotations = function(type) {
        return this._$annotationTuple.get(type._annotation_name);
    };

    p.addAnnotation = function(type, $annotation) {
        this._$annotationTuple.push(type._annotation_name, $annotation);
        this._empty = false;
    };

    p.forEach = function(callback) {
        var data = this._$annotationTuple.data;
        for(var type in data) {
            callback(type, data[type]);
        }
    };

    define.proxy = function(factory, args, scope) {
        var exports;
        currentAnnotation = new Annotation();
        exports = factory.apply(scope, args);
        if(!currentAnnotation.isEmpty()) {
            AnnotationRegistry.register(exports, currentAnnotation);
        }
        return exports;
    };

    return Annotation;

});
define('wozllajs/annotation',[
    './annotation/Annotation',
    './annotation/AnnotationRegistry'
], function(Annotation, AnnotationRegistry) {

    return {
        Annotation : Annotation,
        AnnotationRegistry : AnnotationRegistry
    }
});
define('wozllajs/ajax/param',[],function() {

    return {
        toString : function(query) {
            if(!query) {
                return '';
            }
            var i, str = '';
            for(i in query) {
                str += '&' + i + '=' + query[i];
            }
            if(str) {
                str = str.substr(1);
            }
            return str;
        },
        toQuery : function(str) {
            // TODO
        }
    }
});
define('wozllajs/ajax/xhr',[],function() {
    return function() {
        return new XMLHttpRequest();
    }
});
define('wozllajs/ajax/get',[
    './param'
], function(param) {

    return function(xhr, url, data, contentType, dataType, async) {
        url += '?' + param.toString(data);
        xhr.open('GET', url, async);
        xhr.setRequestHeader('Content-Type', contentType);
        xhr.send();
    }
});
define('wozllajs/ajax/post',[],function() {

    return function() {
        // TODO
    }
});
define('wozllajs/ajax/transport',[
    './../promise',
    './xhr',
    './get',
    './post'
], function(Promise, createXHR, GET, POST) {

    return function(settings) {
        var p = new Promise();

        var xhr, now = Date.now();
        var url = settings.url,
            method = settings.method || 'GET',
            data = settings.data,
            dataType = settings.dataType || 'text',
            contentType = settings.contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
            async = settings.async;

        var mimeType = 'text/plain';
        var responseField = 'responseText';
        var parseResponse = function(text) {
            return text;
        };

        switch (dataType.toLowerCase()) {
            case 'json' :
                mimeType = 'application/json';
                parseResponse = JSON.parse;
                break;
            case 'script' :
            case 'js' :
                mimeType = 'text/javascript';
                break;
            case 'xml' :
                mimeType = 'text/xml';
                responseField = 'responseXML';
                break;
        }

        async = async === false ? async : true;
        if(data) {
            if(!data.t) {
                data.t = now;
            } else {
                data._ = now;
            }
        }

        xhr = createXHR();
        xhr.overrideMimeType(mimeType);

        try {
            switch(method.toUpperCase()) {
                case 'GET' : GET(xhr, url, data, contentType, dataType, async); break;
                case 'POST' : POST(xhr, url, data, contentType, dataType, async); break;
                default : p.sendError(new Error('Unknow request method: ' + method)); break;
            }
        } catch(e) {
            p.sendError(e);
        }

        xhr.onreadystatechange = function() {
            var status, response;
            if(xhr.readyState === 4) {
                try {
                    response = parseResponse(xhr[responseField]);
                } catch(e) {
                    p.sendError(e);
                    return;
                }
                p.done(response, xhr);
            }
        };

        return p;
    };

});
define('wozllajs/ajax',[
    './promise',
    './../wozllajs/ajax/param',
    './../wozllajs/ajax/xhr',
    './../wozllajs/ajax/transport',
    './../wozllajs/ajax/get',
    './../wozllajs/ajax/post'
], function(Promise, param, createXHR, ajaxTransport,GET, POST) {

    return {
        ajax : ajaxTransport,
        get : function(url, data) {
            return ajaxTransport({
                url : url,
                method : 'GET',
                data : data
            });
        },
        getJSON : function(url, data) {
            return ajaxTransport({
                url : url,
                method : 'GET',
                data : data,
                dataType : 'json'
            });
        },
        post : function(url, data) {
            return ajaxTransport({
                url : url,
                method : 'POST',
                data : data
            });
        }
    };

});
define('wozllajs/events/Event',[
    './../var'
], function(W) {

    /**
     * @name Event
     * @class Event 类作为创建 Event 对象的基类，当发生事件时，Event 对象将作为参数传递给事件侦听器。
     * @constructor
     * @param {Object} params
     * @param {String} params.type 指定事件类型
     * @param {Boolean} params.bubbles 指定事件是否冒泡
     */

    var Event = function(params) {

        /**
         * [readonly] 事件类型
         * @type {String}
         */
        this.type = params.type;

        /**
         * [readonly] 事件目标
         * @type {EventTarget}
         */
        this.target = null;

        /**
         * [readonly] 当前正在使用某个事件侦听器处理 Event 对象的对象。
         * @type {EventTarget}
         */
        this.currentTarget = null;

        /**
         * [readonly] 事件流中的当前阶段。
         * @type {int}
         */
        this.eventPhase = null;

        /**
         * [只读] 表示事件是否为冒泡事件。
         * @type {Boolean}
         */
        this.bubbles = params.bubbles;

        this._immediatePropagationStoped = false;
        this._propagationStoped = false;
        this._defaultPrevented = false;
        this._listenerRemoved = false;
    };

    Event.CAPTURING_PHASE = 1;
    Event.BUBBLING_PHASE = 2;
    Event.TARGET_PHASE = 3;

    /**
     * @lends Event.prototype
     */
    var p = Event.prototype;

    /**
     * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。
     */
    p.stopImmediatePropagation = function() {
        this._immediatePropagationStoped = true;
        this._propagationStoped = true;
    };

    /**
     * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。
     */
    p.stopPropagation = function() {
        this._propagationStoped = true;
    };

    /**
     * 如果可以取消事件的默认行为，则取消该行为。
     */
    p.preventDefault = function() {
        this._defaultPrevented = true;
    };

    /**
     * 移除当前正在处理事件的侦听器。
     */
    p.removeListener = function() {
        this._listenerRemoved = true;
    };

    return Event;

});




define('wozllajs/events/EventTarget',[
    './Event'
], function(Event) {

    /**
     *
     * @name EventTarget
     * @class EventTarget 类是可调度事件的所有类的基类。
     * @constructor
     */
    var EventTarget = function() {
        this._captureListeners = {};
        this._listeners = {};
    };

    EventTarget.DEFAULT_ACTION_MAP = {
        'touchstart' : 'onTouchStart',
        'touchmove' : 'onTouchMove',
        'touchend' : 'onTouchEnd',
        'click' : 'onClick'
    };

    /**
     * @lends EventTarget.prototype
     */
    var p = EventTarget.prototype;

    /**
     *
     */
    p.addEventListener = function(eventType, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        var arr = listeners[eventType];
        if (arr) { this.removeEventListener(eventType, listener, useCapture); }
        arr = listeners[eventType];
        if (!arr) {
            listeners[eventType] = [listener];
        }
        else {
            arr.push(listener);
        }
        return listener;
    };

    p.removeEventListener = function(eventType, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        if (!listeners) { return; }
        var arr = listeners[eventType];
        if (!arr) { return; }
        for (var i=0,l=arr.length; i<l; i++) {
            if (arr[i] == listener) {
                if (l==1) {
                    delete(listeners[eventType]);
                }
                else { arr.splice(i,1); }
                break;
            }
        }
    };

    p.hasEventListener = function(eventType) {
        var listeners = this._listeners, captureListeners = this._captureListeners;
        return !!((listeners && listeners[eventType]) || (captureListeners && captureListeners[eventType]));
    };

    p.dispatchEvent = function(event) {
        var i, len, list, object, defaultAction;
        event.target = this;
        if(false === event.bubbles) {
            event.eventPhase = Event.TARGET_PHASE;
            if(!this._dispatchEvent(event)) {
                defaultAction = this[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            return;
        }

        list = this._getAncients();
        event.eventPhase = Event.CAPTURING_PHASE;
        for(i=list.length-1; i>=0 ; i--) {
            object = list[i];
            if(!object._dispatchEvent(event)) {
                defaultAction = object[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            if(event._propagationStoped) {
                return;
            }
        }
        event.eventPhase = Event.TARGET_PHASE;
        if(!this._dispatchEvent(event)) {
            defaultAction = this[EventTarget.DEFAULT_ACTION_MAP[event.type]];
            defaultAction && defaultAction(event);
        }
        if(event._propagationStoped) {
            return;
        }
        event.eventPhase = Event.BUBBLING_PHASE;
        for(i=0,len=list.length; i<len; i++) {
            object = list[i];
            if(!object._dispatchEvent(event)) {
                defaultAction = object[EventTarget.DEFAULT_ACTION_MAP[event.type]];
                defaultAction && defaultAction(event);
            }
            if(event._propagationStoped) {
                return;
            }
        }
    };

    p._getAncients = function() {
        var list = [];
        var parent = this;
        while (parent._parent) {
            parent = parent._parent;
            list.push(parent);
        }
        return list;
    };

    p._dispatchEvent = function(event) {
        var i, len, arr, listeners, handler;
        event.currentTarget = this;
        event._listenerRemoved = false;
        listeners = event.eventPhase === Event.CAPTURING_PHASE ? this._captureListeners : this._listeners;
        if(listeners) {
            arr = listeners[event.type];
            if(!arr || arr.length === 0) return event._defaultPrevented;
            arr = arr.slice();
            for(i=0,len=arr.length; i<len; i++) {
                event._listenerRemoved = false;
                handler = arr[i];
                handler(event);
                if(event._listenerRemoved) {
                    this.removeEventListener(event.type, handler, event.eventPhase === Event.CAPTURING_PHASE);
                }
                if(event._immediatePropagationStoped) {
                    break;
                }
            }
        }
        return event._defaultPrevented;
    };

    return EventTarget;
});



define('wozllajs/events',[
    './events/Event',
    './../wozllajs/events/EventTarget'
], function(Event, EventTarget) {

    return {
        Event : Event,
        EventTarget : EventTarget
    };
});
define('wozllajs/preload/AsyncImage',[
    'require',
    './../var'
], function(require, W) {

    var AsyncImage = function(image) {
        this.image = image;
        this.src = this.image.src;
    };

    var p = AsyncImage.prototype;

    p.draw = function(context) {
        // TODO optimize performance for slice and unshift
        var args = W.slice(arguments, 1);
        var image = this.image;
        if(image) {
            args.unshift(image);
            context.drawImage.apply(context, args);
        }
    };

    p.drawAs9Grid = function(context, region, grid, width, height) {
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

    p.reload = function() {
        var me = this;
        var ImageLoader = require('./ImageLoader');
        return ImageLoader.loadSrc(this.src).then(function(image) {
            return me.image = image;
        });
    };

    return AsyncImage;
});
define('wozllajs/preload/Loader',[
    './../var'
], function(W) {

    var Loader = function(item) {
        this._item = item;
    };

    var p = Loader.prototype;

    p.load = function() {};

    return Loader;
});
define('wozllajs/preload/ImageLoader',[
    'require',
    './../var',
    './../promise',
    './Loader',
    './AsyncImage'
], function(require, W, Promise, Loader, AsyncImage) {

    var ImageLoader = function() {
        Loader.apply(this, arguments);
    };

    ImageLoader.loadSrc = function(src) {
        var p = new Promise();
        var image = new Image();
        image.src = src;
        image.onload = function() {
            p.done(image);
        };
        image.onerror = function() {
            p.sendError(new Error('Fail to load image, ' + src));
        };
        return p;
    };

    ImageLoader.loadAsyncImage = function(src) {
        return ImageLoader.loadSrc(src).then(function(image) {
            return new AsyncImage(image);
        });
    };

    var p = W.inherits(ImageLoader, Loader);

    p.load = function() {
        return ImageLoader.loadAsyncImage(this._item['src']);
    };

    return ImageLoader;
});
define('wozllajs/preload/StringLoader',[
    'require',
    './../var',
    './../promise',
    './Loader'
], function(require, W, Promise, Loader) {

    var StringLoader = function() {
        Loader.apply(this, arguments);
    };

    var p = W.inherits(StringLoader, Loader);

    p.load = function() {
        return W.get(this._item['src']);
    };

    return StringLoader;
});
define('wozllajs/preload/JSONLoader',[
    'require',
    './../var',
    './../promise',
    './Loader'
], function(require, W, Promise, Loader) {

    var JSONLoader = function() {
        Loader.apply(this, arguments);
    };

    var p = W.inherits(JSONLoader, Loader);

    p.load = function() {
        return W.getJSON(this._item['src']);
    };

    return JSONLoader;
});
define('wozllajs/preload/LoadQueue',[
    'require',
    './../var',
    './../promise',
    './ImageLoader',
    './StringLoader',
    './JSONLoader'
], function(require, W, Promise, ImageLoader, StringLoader, JSONLoader) {

    var baseUrl = '';
    var loaderMap = {
        'jpg' : ImageLoader,
        'png' : ImageLoader,
        'json' : JSONLoader
    };
    var cache = {},
        loadQueue = [],
        loading = false;

    // TODO cancel operation
    var loadingMap = {}, cancelMap = {};

    function createLoader(item) {
        var loaderConstructor = loaderMap[item.type] || StringLoader;
        return new loaderConstructor(item);
    }

    function loadNext() {
        if(loading || loadQueue.length === 0) {
            return;
        }
        var loadUnit, promise, loads, item, id, loader, cachedItem;
        var i, len;
        var promises = [];
        var loadedResult = {};
        loading = true;
        loadUnit = loadQueue.shift();
        promise = loadUnit.promise;
        loads = loadUnit.loads;
        for(i=0,len=loads.length; i<len; i++) {
            item = loads[i];
            id = item.id;
            cachedItem = cache[id];
            if(!cachedItem) {
                loader = createLoader(item);
                (function(id, loader, item) {
                    var p = loader.load().then(function(result) {
                        item.result = result;
                        cache[id] = item;
                        loadedResult[id] = result;
                    }).catchError(function(error) {
                        console.log(error);
                    });
                    promises.push(p);
                })(id, loader, item);
            } else {
                loadedResult[id] = cachedItem.result;
            }
        }
        if(promises.length === 0) {
            setTimeout(function() {
                promise.done(loadedResult);
                loading = false;
                loadNext();
            }, 1);
        } else {
            Promise.wait(promises).then(function() {
                promise.done(loadedResult);
                loading = false;
                loadNext();
            });
        }
    }

    return {
        load : function(items, base) {
            if(!W.isArray(items)) {
                items = [items];
            }
            var p = new Promise();
            var loads = [];
            var repeatTestFlag = {};
            var i, len, item, src;
            for(i=0,len=items.length; i<len; i++) {
                item = items[i];
                if(typeof item === 'string') {
                    src = item;
                    item = {
                        id : src,
                        src : (base || baseUrl) + src
                    };
                }
                if(!item.type) {
                    item.type = src.substr(src.lastIndexOf('.') + 1);
                }
                if(!repeatTestFlag[item.id]) {
                    loads.push(item);
                    repeatTestFlag[item.id] = true;
                }
            }
            loadQueue.push({
                promise : p,
                loads : loads
            });
            loadNext();
            return p;
        },
        get : function(id) {
            var cached = cache[id];
            if(!cached) {
                return null;
            }
            return cached.result;
        },
        remove : function(id) {
            var resource = cache[id].result;
            if(resource) {
                if(W.isImage(resource)) {
                    resource.dispose && resource.dispose();
                }
                delete cache[id];
            }
        },
        registerLoader : function(fileExtension, loaderConstructor) {
            loaderMap[fileExtension] = loaderConstructor;
        },
        unregisterLoader : function(fileExtension) {
            delete loaderMap[fileExtension];
        },
        setBaseUrl : function(base) {
            baseUrl = base;
        }
    };

});
define('wozllajs/preload',[
    './var',
    './../wozllajs/preload/AsyncImage',
    './../wozllajs/preload/Loader',
    './../wozllajs/preload/ImageLoader',
    './../wozllajs/preload/LoadQueue',
    './../wozllajs/preload/JSONLoader',
    './../wozllajs/preload/StringLoader'
], function(W, AsyncImage, Loader, ImageLoader, LoadQueue, JSONLoader, StringLoader) {

    return {
        AsyncImage : AsyncImage,
        Loader : Loader,
        ImageLoader : ImageLoader,
        LoadQueue : LoadQueue,
        JSONLoader : JSONLoader,
        StringLoader : StringLoader
    };
});
define('wozllajs/assets/Texture',[
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
define('wozllajs/assets/TextureLoader',[
    './../var',
    './../ajax',
    './../promise',
    './Texture',
    './../preload/Loader',
    './../preload/LoadQueue',
    './../preload/ImageLoader'
], function(W, ajax, Promise, Texture, Loader, LoadQueue, ImageLoader) {

    var TextureLoader = function() {
        Loader.apply(this, arguments);
    };

    var p = W.inherits(TextureLoader, Loader);

    p.load = function() {
        var src = this._item['src'];
        var imageSrc = src.replace('.json', '.png');
        return Promise.wait(ajax.getJSON(src), ImageLoader.loadSrc(imageSrc)).then(function(ajaxResult, image) {
            return new Texture(image, ajaxResult[0].frames);
        });
    };

    LoadQueue.registerLoader('tt', TextureLoader);

    return TextureLoader;
});
define('wozllajs/assets',[
    './assets/Texture',
    './../wozllajs/assets/TextureLoader'
], function(Texture, TextureLoader) {

    return {
        Texture : Texture,
        TextureLoader : TextureLoader
    }
});
define('wozllajs/core/Time',[],function() {
    return {

        delta : 0,

        now : 0,

        update : function() {
            var now = Date.now();
            if(this.now) {
                this.delta = now - this.now;
            }
            this.now = now;
        },

        reset : function() {
            this.delta = 0;
            this.now = 0;
        }
    };
});
define('wozllajs/core/Transform',[
    './../math/Matrix2D'
], function(Matrix2D) {

    // 一个createjs类用于帮助从Transform到canvas的context中的transform参数
    var matrix = new Matrix2D();

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
            matrix.identity();
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
            return matrix.identity()
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
define('wozllajs/core/AbstractGameObject',[
    'require',
    './../var',
    './../events/EventTarget',
    './Transform'
], function(require, W, EventTarget, Transform) {

    /**
     *
     * @name AbstractGameObject
     * @class AbstractGameObject 类是所以游戏对象的基类，其定义了树形结构，并继承 EventTarget 以实现游戏中的事件调度
     * @constructor
     * @abstract
     * @extends EventTarget
     * @param {Object} params
     * @param {String} params.id
     */
    var AbstractGameObject = function(params) {
        EventTarget.apply(this, arguments);

        this.id = params.id;
        this.UID = W.uniqueKey();
        this.transform = new Transform({ gameObject: this });
        this._parent = null;
        this._children = [];
        this._childrenMap = {};
    };

    var p = W.inherits(AbstractGameObject, EventTarget);

    p.setId = function(id) {
        if(this._parent) {
            delete this._parent._childrenMap[this.id];
            this._parent._childrenMap[id] = this;
        }
        this.id = id;
    };

    p.getParent = function() {
        return this._parent;
    };

    p.getPath = function(seperator) {
        var o = this;
        var path = [];
        while(o) {
            path.unshift(o.id);
            o = o._parent;
        }
        return path.join(seperator || '/');
    };

    p.getStage = function() {
        return require('./Stage').root;
    };

    p.getChildren = function() {
        return this._children.slice();
    };

    p.sortChildren = function(func) {
        this._children.sort(func);
    };

    p.getObjectById = function(id) {
        return this._childrenMap[id];
    };

    p.addObject = function(obj) {
        this._childrenMap[obj.id] = obj;
        this._children.push(obj);
        obj._parent = this;
    };

    p.insertObject = function(obj, index) {
        this._childrenMap[obj.id] = obj;
        this._children.splice(index, 0, obj);
        obj._parent = this;
    };

    p.insertBefore = function(obj, objOrId) {
        var i, len, child;
        var index = 0;
        for(i=0,len=this._children.length; i<len; i++) {
            child = this._children[i];
            if(child === objOrId || child.id === objOrId) {
                index = i;
                break;
            }
        }
        this.insertObject(obj, index);
    };

    p.insertAfter = function(obj, objOrId) {
        var i, len, child;
        var index = this._children.length;
        for(i=0,len=this._children.length; i<len; i++) {
            child = this._children[i];
            if(child === objOrId || child.id === objOrId) {
                index = i;
                break;
            }
        }
        this.insertObject(obj, index+1);
    };

    p.removeObject = function(idOrObj) {
        var children = this._children;
        var obj = typeof idOrObj === 'string' ? this._childrenMap[idOrObj] : idOrObj;
        var idx = -1;
        var i, len;
        for(i=0,len=children.length; i<len; i++) {
            if(obj === children[i]) {
                idx = i;
                children.splice(idx, 1);
                break;
            }
        }
        if(idx !== -1) {
            delete this._childrenMap[obj.id];
            obj._parent = null;
            obj.transform.parent = null;
        }
        return idx;
    };

    p.remove = function(params) {
        this._parent && this._parent.removeObject(this);
        this._parent = null;
    };

    p.removeAll = function(params) {
        this._children = [];
        this._childrenMap = {};
    };

    p.findObjectById = function(id) {
        var i, len, children;
        var obj = this.getObjectById(id);
        if(!obj) {
            children = this._children;
            for(i=0,len=children.length; i<len; i++) {
                obj = children[i].findObjectById(id);
                if(obj) break;
            }
        }
        return obj;
    };

    p.findObjectByPath = function(path, seperator) {
        var i, len;
        var paths = path.split(seperator || '/');
        var obj = this.findObjectById(paths[0]);
        if(obj) {
            for(i=1, len=paths.length; i<len; i++) {
                obj = obj.getObjectById(paths[i]);
                if(!obj) return null;
            }
        }
        return obj;
    };

    return AbstractGameObject;

});
define('wozllajs/core/Component',[
    './../var'
], function(W) {

    function Component() {
        this.UID = W.uniqueKey();
        this.gameObject = null;
    }

    var p = Component.prototype;

    p.alias = undefined;

    p.properties = {}; // for build

    p.setGameObject = function(gameObject) {
        this.gameObject = gameObject;
    };

    p.initComponent = function() {
        this.applyProperties(this.properties);
    };

    p.destroyComponent = function() {};

    p.on = function() {
        this.gameObject.addEventListener.apply(this.gameObject, arguments);
    };

    p.off = function() {
        this.gameObject.removeEventListener.apply(this.gameObject, arguments);
    };

    p.dispatchEvent = function(event) {
        this.gameObject.dispatchEvent(event);
    };

    p.applyProperties = function(properties) {
        for(var p in properties) {
            this[p] = properties[p];
        }
    };

    p.isInstanceof = function(type) {
        return this instanceof type;
    };

    return Component;

});
define('wozllajs/core/Behaviour',[
    './../var',
    './Component'
], function(W, Component) {

    function Behaviour() {
        Component.apply(this, arguments);
        this.enabled = false;
    }

    var p = W.inherits(Behaviour, Component);

    p.update = function() {};
    p.lateUpdate = function() {};

    return Behaviour;

});
define('wozllajs/core/Renderer',[
    './../var',
    './Component'
], function(W, Component) {

    function Renderer() {
        Component.apply(this, arguments);
    }

    var p = W.inherits(Renderer, Component);

    p.draw = function(context, visibleRect) {};

    return Renderer;

});
define('wozllajs/core/Layout',[
    './../var',
    './Component'
], function(W, Component) {

    function Layout() {
        Component.apply(this, arguments);
    }

    var p = W.inherits(Layout, Component);

    p.doLayout = function(x, y) {};

    return Layout;

});
define('wozllajs/core/HitDelegate',[
    './../var',
    './Component'
], function(W, Component) {

    function HitDelegate() {
        Component.apply(this, arguments);
    }

    var p = W.inherits(HitDelegate, Component);

    p.testHit = function(x, y) {};

    return HitDelegate;

});
define('wozllajs/core/Query',[
    'require',
    './Component'
], function(require, Component) {

    /**
     * Query(gameObject, './text/path:renderer.Image');
     *
     */

    /**
     * 分组:
     *  1. relative position / absolute position
     *  4. path
     *  9. component alias
     */
    var queryRegex = /^((\.\/)|(\/))?(([a-zA-Z0-9]+?)|(([a-zA-Z0-9]+?\/)+?[a-zA-Z0-9]+?))(:([a-zA-Z0-9\.\-]+?))?$/;

    var Query = function(expression, context) {
        context = context || require('./Stage').root;
        if(!context) {
            throw new Error('Cant found context for query');
        }
        var result = queryRegex.exec(expression);
        var startPos = result[1] || './';
        var path = result[4];
        var compAlias = result[9];
        var find;
        if(startPos === './') {
            find = context.findObjectByPath(path);
        } else {
            while(context._parent) {
                context = context._parent;
            }
            find = context.findObjectByPath(path);
        }
        if(find && compAlias) {
            find = Query.findComponent(find, compAlias);
        }
        return find;
    };

    Query.findComponent = function(obj, param) {
        var doFind =
            (typeof param === 'string' && param.indexOf('c-') === 0) ||
                (typeof param === 'function' && Component.prototype.isPrototypeOf &&
                    Component.prototype.isPrototypeOf(param.prototype));
        return doFind && obj.getComponent(param);
    };

    return Query;
});
define('wozllajs/core/events/GameObjectEvent',[
    './../../var',
    './../../events/Event'
], function(W, Event) {

    var GameObjectEvent = function(param) {
        Event.apply(this, arguments);
    };

    GameObjectEvent.INIT = 'init';
    GameObjectEvent.DESTROY = 'destroy';

    W.inherits(GameObjectEvent, Event);

    return GameObjectEvent;

});
define('wozllajs/core/UnityGameObject',[
    './../var',
    './../globals',
    './AbstractGameObject',
    './Component',
    './Behaviour',
    './Renderer',
    './Layout',
    './HitDelegate',
    './Query',
    './events/GameObjectEvent'
], function(W, G, AbstractGameObject, Component, Behaviour, Renderer, Layout, HitDelegate, Query, GameObjectEvent) {

    var testHitCanvas = W.createCanvas(1, 1);
    var testHitContext = testHitCanvas.getContext('2d');

    var UnityGameObject = function(param) {
        AbstractGameObject.apply(this, arguments);
        this._active = true;
        this._visible = true;
        this._initialized = false;
        this._components = [];
        this._delayRemoves = [];
    };

    var p = W.inherits(UnityGameObject, AbstractGameObject);

    p.isActive = function(upWards) {
        if(upWards === false) {
            return this._active;
        }
        var active = true;
        var o = this;
        while(o) {
            active = active && o._active;
            if(!active) {
                return false;
            }
            o = o._parent;
        }
        return active;
    };

    p.setActive = function(active) {
        this._active = active;
    };

    p.isVisible = function(upWards) {
        if(upWards === false) {
            return this._visible;
        }
        var visible = true;
        var o = this;
        while(o) {
            visible = visible && o._visible;
            if(!visible) {
                return false;
            }
            o = o._parent;
        }
        return visible;
    };

    p.setVisible = function(visible) {
        this._visible = visible;
    };

    p.addComponent = function(component) {
        this._components.push(component);
        component.setGameObject(this);
    };

    p.getComponent = function(type) {
        var i, len, comp;
        var components = this._components;
        var alias;
        if(typeof type === 'string') {
            alias = type;
            for(i=0,len=components.length; i<len; i++) {
                comp = components[i];
                if(comp.alias === alias) {
                    return comp;
                }
            }
        }
        else {
            for(i=0,len=components.length; i<len; i++) {
                comp = components[i];
                if(comp.isInstanceof(type)) {
                    return comp;
                }
            }
        }
        return null;
    };

    p.getComponents = function(type) {
        var i, len, comp, alias;
        var components = this._components;
        var found = [];
        if(typeof type === 'string') {
            alias = type;
            for(i=0,len=components.length; i<len; i++) {
                comp = components[i];
                if(comp.alias === alias) {
                    found.push(comp);
                }
            }
        } else {
            for(i=0,len=components.length; i<len; i++) {
                comp = components[i];
                if(comp.isInstanceof(type)) {
                    found.push(comp);
                }
            }
        }
        return found;
    };

    p.removeComponent = function(component) {
        var i, len, comp;
        var components = this._components;
        for(i=0,len=components.length; i<len; i++) {
            comp = components[i];
            if(comp === component) {
                components.splice(i, 1);
                comp.setGameObject(null);
                break;
            }
        }
    };

    p.delayRemoveComponent = function(component) {
        this._delayRemoves.push(component);
    };

    p.delayRemoveObject = function(gameObject) {
        this._delayRemoves.push(gameObject);
    };

    p.delayRemove = function() {
        this._parent.delayRemoveObject(this);
    };

    p.query = function(expression) {
        return Query(expression, this);
    };

    p.sendMessage = function(methodName, args, type) {
        var i, len, comp, method;
        var components = this._components;
        for(i=0,len=components.length; i<len; i++) {
            comp = components[i];
            if(!type || (type && comp.isInstanceof(type))) {
                method = comp[methodName];
                method && method.apply(comp, args);
            }
        }
    };

    p.broadcastMessage = function(methodName, args) {
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.broadcastMessage(methodName, args);
        }
        this.sendMessage(methodName, args);
    };

    p.init = function() {
        var i, len, child;
        var children = this._children;
        this.sendMessage(G.METHOD_INIT_COMPONENT);
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.init();
        }
        this.layout();
        this._doDelayRemove();
        this._initialized = true;
        this.dispatchEvent(new GameObjectEvent({
            type : GameObjectEvent.INIT,
            bubbles : true
        }))
    };

    p.destroy = function() {
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.destroy();
        }
        this._doDelayRemove();
        this.sendMessage(G.METHOD_DESTROY_COMPONENT);
        this.dispatchEvent(new GameObjectEvent({
            type : GameObjectEvent.DESTROY,
            bubbles : true
        }))
    };

    p.layout = function() {
        var layout = this.getComponent(Layout);
        var children = this._children;
        var i, len, child;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.layout();
        }
        layout && layout.doLayout();
    };

    p.update = function() {
        if(!this._initialized || !this._active) return;
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.update();
        }
        this.sendMessage(G.METHOD_UPDATE, null, Behaviour);
        this._doDelayRemove();
    };

    p.lateUpdate = function() {
        if(!this._initialized || !this._active) return;
        var i, len, child;
        var children = this._children;
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.lateUpdate();
        }
        this.sendMessage(G.METHOD_LATE_UPDATE, null, Behaviour);
        this._doDelayRemove();
    };

    p.draw = function(context, visibleRect) {
        if(!this._initialized || !this._active || !this._visible) return;
        context.save();
        this.transform.updateContext(context);
        this._draw(context, visibleRect);
        context.restore();
        this._doDelayRemove();
    };

    p.testHit = function(x, y, onlyRenderSelf) {
        var hit = false, hitDelegate, renderer;
        if(!this.isActive(true) || !this.isVisible(true)) {
            return false;
        }
        hitDelegate = this.getComponent(HitDelegate);
        if(hitDelegate) {
            hit = hitDelegate.testHit(x, y);
        }
        else if(this._cacheCanvas && this._cached) {
            hit = this._cacheContext.getImageData(-this._cacheOffsetX+x, -this._cacheOffsetY+y, 1, 1).data[3] > 1;
        }
        else {
            testHitContext.setTransform(1, 0, 0, 1, -x, -y);
            if(onlyRenderSelf) {
                renderer = this.getComponent(Renderer);
                if(!renderer) {
                    hit = false;
                } else {
                    renderer.draw(testHitContext, this.getStage().getVisibleRect());
                }
            } else {
                this._draw(testHitContext, this.getStage().getVisibleRect());
            }
            hit = testHitContext.getImageData(0, 0, 1, 1).data[3] > 1;
            testHitContext.setTransform(1, 0, 0, 1, 0, 0);
            testHitContext.clearRect(0, 0, 2, 2);
        }
        return hit;
    };

    p.getTopObjectUnderPoint = function(x, y) {
        var i, child, obj, localPoint;
        for(i=this._children.length-1; i>=0 ; i--) {
            child = this._children[i];
            obj = child.getTopObjectUnderPoint(x, y);
            if(obj) {
                return obj;
            }
        }
        localPoint = this.transform.globalToLocal(x, y);
        if(this.testHit(localPoint.x, localPoint.y, true)) {
            return this;
        }
        return null;
    };

    p._doDelayRemove = function() {
        var i, len, target;
        if(this._delayRemoves.length > 0) {
            for(i=0,len=this._delayRemoves.length; i<len; i++) {
                target = this._delayRemoves[i];
                if(target instanceof AbstractGameObject) {
                    this.removeObject(target);
                }
                else if(target instanceof Component) {
                    this.removeComponent(target);
                }
            }
            this._delayRemoves.length = 0;
        }
    };

    p._draw = function(context, visibleRect) {
        var i, len, child;
        var children = this._children;
        this.sendMessage(G.METHOD_DRAW, arguments, Renderer);
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            child.draw(context, visibleRect);
        }
    };

    return UnityGameObject;
});
define('wozllajs/core/Filter',[
    './../var',
    './Component'
], function(W, Component) {

    function Renderer() {
        Component.apply(this, arguments);
        this.enabled = false;
    }

    var p = W.inherits(Renderer, Component);

    p.applyFilter = function(cacheContext, x, y, width, height) {};

    return Renderer;

});
define('wozllajs/core/CachableGameObject',[
    'module',
    './../var',
    './../globals',
    './UnityGameObject',
    './Filter',
], function(module, W, G, UnityGameObject, Filter) {

    var CachableGameObject = function(param) {
        UnityGameObject.apply(this, arguments);

        this._cacheCanvas = null;
        this._cacheContext = null;
        this._cached = false;
        this._cacheOffsetX = 0;
        this._cacheOffsetY = 0;
    };

    var p = W.inherits(CachableGameObject, UnityGameObject);

    p.cache = function(x, y, width, height) {
        if(this._cacheCanvas) {
            this.uncache();
        }
        this._cacheOffsetX = x;
        this._cacheOffsetY = y;
        this._cacheCanvas = W.createCanvas(width, height);
        this._cacheContext = this._cacheCanvas.getContext('2d');
        this._cached = false;
    };

    p.updateCache = function(offsetX, offsetY) {
        this._cached = false;
        this._cacheOffsetX = offsetX || this._cacheOffsetX;
        this._cacheOffsetY = offsetY || this._cacheOffsetY;
    };

    p.translateCache = function(deltaX, deltaY) {
        this._cached = false;
        this._cacheOffsetX += deltaX;
        this._cacheOffsetY += deltaY;
    };

    p.uncache = function() {
        if(this._cacheCanvas) {
            this._cacheContext.dispose && this._cacheContext.dispose();
            this._cacheCanvas.dispose && this._cacheCanvas.dispose();
            this._cacheCanvas = null;
        }
        this._cached = false;
    };

    p._draw = function(context, visibleRect) {
        if(this._cacheCanvas) {
            if(!this._cached) {
                this._drawCache();
                this._cached = true;
            }
            context.drawImage(this._cacheCanvas, 0, 0);
        } else {
            UnityGameObject.prototype._draw.apply(this, arguments);
        }
    };

    p._drawCache = function(context, visibleRect) {
        var cacheContext = this._cacheContext;
        cacheContext.clearRect(0, 0, this._cacheCanvas.width, this._cacheCanvas.height);
        cacheContext = this._cacheContext;
        cacheContext.translate(-this._cacheOffsetX, -this._cacheOffsetY);
        this._draw(cacheContext, visibleRect);
        cacheContext.translate(this._cacheOffsetX, this._cacheOffsetY);
        this._applyFilters(cacheContext, 0, 0, this._cacheCanvas.width, this._cacheCanvas.height);
    };

    p._applyFilters = function(cacheContext, x, y, width, height) {
        var id, filter;
        var filters = this.getComponents(Filter);
        for(id in filters) {
            cacheContext.save();
            filter = filters[id];
            filter.applyFilter(cacheContext, x, y, width, height);
            cacheContext.restore();
        }
    };


    return CachableGameObject;
});
define('wozllajs/core/Stage',[
    './../var',
    './CachableGameObject'
], function(W, CachableGameObject) {

    var visibleRect = {
        x : 0,
        y : 0,
        width : 0,
        height : 0
    };

    var Stage = function(param) {
        CachableGameObject.apply(this, arguments);
        this.autoClear = param.autoClear;
        this.width = param.width;
        this.height = param.height;
        this.stageCanvas = param.canvas;
        this.stageContext = this.stageCanvas.getContext('2d');
    };

    Stage.root = null;

    var p = W.inherits(Stage, CachableGameObject);

    p.tick = function() {
        this.update();
        this.lateUpdate();
        this.draw();
    };

    p.draw = function() {
        this.autoClear && this.stageContext.clearRect(0, 0, this.width, this.height);
        CachableGameObject.prototype.draw.apply(this, [this.stageContext, this.getVisibleRect()]);
    };

    p.resize = function(width, height) {
        this.stageCanvas.width = width;
        this.stageCanvas.height = height;
        this.width = width;
        this.height = height;
    };

    p.getVisibleRect = function() {
        visibleRect.x = -this.transform.x;
        visibleRect.y = -this.transform.y;
        visibleRect.width = this.width;
        visibleRect.height = this.height;
        return visibleRect;
    };

    return Stage;

});
define('wozllajs/core/Engine',[
    './Time',
    './../util/Tuple',
    './Stage'
], function(Time, Tuple, Stage) {

    var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function(frameCall, intervalTime) {
                setTimeout(frameCall, intervalTime);
            };

    var ENGINE_EVENT_TYPE = 'Engine';
    var engineEventListeners = new Tuple();
    var running = true;
    var frameTime;

    /**
     * 主循环中一帧
     */
    function frame() {
        if(!running) {
            Time.reset();
            return;
        }
        Time.update();
        fireEngineEvent();
        // is it good?
        Stage.root && Stage.root.tick();
        requestAnimationFrame(frame, frameTime);
    }

    function fireEngineEvent() {
        var i, len, listener, ret;
        var listeners = engineEventListeners.get(ENGINE_EVENT_TYPE);
        if(!listeners || listeners.length === 0) {
            return;
        }
        listeners = [].concat(listeners);
        for(i=0, len=listeners.length; i<len; i++) {
            listener = listeners[i];
            listener.apply(listener, arguments);
        }
    }

    return {

        /**
         * 添加一个listener在主循环中调用
         * @param listener {function}
         */
        addListener : function(listener) {
            // special for Stage
            var stage;
            if(listener.isStage) {
                stage = listener;
                if(stage.__engineTick) {
                    return;
                }
                stage.__engineTick = function() {
                    stage.update();
                    stage.lateUpdate();
                    stage.draw();
                };
                listener = stage.__engineTick;
            }
            engineEventListeners.push(ENGINE_EVENT_TYPE, listener);
        },
        /**
         * 移除主循环中的一个listener
         * @param listener {function}
         */
        removeListener : function(listener) {
            var stage;
            if(listener.isStage) {
                stage = listener;
                if(!stage.__engineTick) {
                    return;
                }
                listener = stage.__engineTick;
                stage.__engineTick = null;
            }
            engineEventListeners.remove(ENGINE_EVENT_TYPE, listener);
        },

        /**
         * 开始主循环或重新开始主循环
         */
        start : function(newFrameTime) {
            frameTime = newFrameTime || 10;
            running = true;
            requestAnimationFrame(frame, frameTime);
        },

        /**
         * 停止主循环
         */
        stop : function() {
            running = false;
        },

        /**
         * 运行一步
         */
        runStep : function() {
            Time.update();
            Time.delta = frameTime;
            fireEngineEvent();
        }
    }

});
define('wozllajs/core/GameObject',[
    './CachableGameObject'
], function(CachableGameObject) {
    return CachableGameObject;
});
define('wozllajs/core/Collider',[
    './../var',
    './Component'
], function(W, Component) {

    function Collider() {
        Component.apply(this, arguments);
    }

    var p = W.inherits(Collider, Component);

    return Collider;

});
define('wozllajs/core/events/TouchEvent',[
    './../../var',
    './../../events/Event'
], function(W, Event) {

    var TouchEvent = function(param) {
        Event.apply(this, arguments);
        this.x = param.x;
        this.y = param.y;
    };

    TouchEvent.TOUCH_START = 'touchstart';
    TouchEvent.TOUCH_END = 'touchend';
    TouchEvent.TOUCH_MOVE = 'touchmove';
    TouchEvent.CLICK = 'click';

    W.inherits(TouchEvent, Event);

    return TouchEvent;

});
define('wozllajs/core/Touch',[
    './../var/support',
    './events/TouchEvent'
], function(support, TouchEvent) {

    var stage;
    var enabled = true;

    var touchstartTarget;
    var touchendTarget;
    var canvasOffsetCache;

    function getCanvasOffset() {
        if(canvasOffsetCache) return canvasOffsetCache;
        var obj = stage.stageCanvas;
        var offset = { x : obj.offsetLeft, y : obj.offsetTop };
        while ( obj = obj.offsetParent ) {
            offset.x += obj.offsetLeft;
            offset.y += obj.offsetTop;
        }
        canvasOffsetCache = offset;
        return offset;
    }

    function onEvent(e) {
        if(!enabled) return;
        var doDispatch = false;
        var target, touchEvent, canvasOffset, x, y, t;
        var type = e.type;
        canvasOffset = getCanvasOffset();
        // mouse event
        if (!e.touches) {
            x = e.pageX - canvasOffset.x;
            y = e.pageY - canvasOffset.y;
        }
        // touch event
        else if(e.changedTouches) {
            t = e.changedTouches[0];
            x = t.pageX - canvasOffset.x;
            y = t.pageY - canvasOffset.y;
        }

        target = stage.getTopObjectUnderPoint(x, y);

        if(type === 'mousedown') {
            type = TouchEvent.TOUCH_START;
            touchstartTarget = target;
            touchendTarget = null;
            doDispatch = true;
        }
        else if(type === 'mouseup' && touchstartTarget === target) {
            type = TouchEvent.TOUCH_END;
            touchendTarget = target;
            doDispatch = true;
        }
        else if(type === 'mousemove' && touchstartTarget === target) {
            type = TouchEvent.TOUCH_MOVE;
            doDispatch = true;
        }

        if(target && doDispatch) {
            touchEvent = new TouchEvent({
                type : type,
                x : x,
                y : y
            });
            target.dispatchEvent(touchEvent);
            if(type === TouchEvent.TOUCH_END) {
                if(touchendTarget && touchstartTarget === touchendTarget) {
                    touchstartTarget = null;
                    touchendTarget = null;
                    touchendTarget.dispatchEvent(new TouchEvent({
                        type : TouchEvent.CLICK,
                        x : x,
                        y : y
                    }));
                }
            }
        }
    }


    return {
        init : function(theStage) {
            var canvas = theStage.stageCanvas;
            stage = theStage;

            if(support.touch) {
                canvas.addEventListener("touchstart", onEvent, false);
                canvas.addEventListener("touchend", onEvent, false);
                canvas.addEventListener("touchmove", onEvent, false);
            } else {
                var down = false;
                canvas.addEventListener("mousedown", function(e) {
                    down = true;
                    onEvent(e);
                }, false);
                canvas.addEventListener("mouseup", function(e) {
                    down = false;
                    onEvent(e);
                }, false);
                canvas.addEventListener("mousemove", function(e) {
                    if(down) {
                        onEvent(e);
                    }
                }, false);
            }
        },
        enable : function() {
            enabled = true;
        },
        disable : function() {
            enabled = false;
        }
    }
});
define('wozllajs/core',[
    './core/Time',
    './../wozllajs/core/Engine',
    './../wozllajs/core/AbstractGameObject',
    './../wozllajs/core/UnityGameObject',
    './../wozllajs/core/CachableGameObject',
    './../wozllajs/core/GameObject',
    './../wozllajs/core/Transform',
    './../wozllajs/core/Component',
    './../wozllajs/core/Behaviour',
    './../wozllajs/core/Collider',
    './../wozllajs/core/Filter',
    './../wozllajs/core/HitDelegate',
    './../wozllajs/core/Renderer',
    './../wozllajs/core/Stage',
    './../wozllajs/core/Touch',
    './../wozllajs/core/Query',
    './../wozllajs/core/events/GameObjectEvent',
    './../wozllajs/core/events/TouchEvent'
], function(Time, Engine, AbstractGameObject, UnityGameObject, CachableGameObject, GameObject, Transform, Component,
    Behaviour, Collider, Filter, HitDelegate, Renderer, Stage, Touch, Query, GameObjectEvent, TouchEvent) {

    var cfg;

    var config = function(configuration) {
        cfg = configuration;
    };

    var onStageInit = function(callback) {
        var stage = new Stage({
            id : 'wozllajs_Stage',
            canvas : cfg.canvas,
            width : cfg.width || cfg.canvas.width,
            height : cfg.height || cfg.canvas.height,
            autoClear : cfg.autoClear
        });
        cfg.canvas.width = cfg.width;
        cfg.canvas.height = cfg.height;
        stage.addEventListener(GameObjectEvent.INIT, function(e) {
            e.removeListener();
            setTimeout(function() {
                callback && callback(stage);
            }, 1);
        });
        Stage.root = stage;
        Touch.init(stage);
        stage.init();
        Engine.start();
    };

    return {

        config : config,
        onStageInit : onStageInit,

        Time : Time,
        Engine : Engine,
        AbstractGameObject : AbstractGameObject,
        UnityGameObject : UnityGameObject,
        CachableGameObject : CachableGameObject,
        GameObject : GameObject,
        Transform : Transform,
        Component : Component,
        Behaviour : Behaviour,
        Filter : Filter,
        HitDelegate : HitDelegate,
        Renderer : Renderer,
        Stage : Stage,
        Touch : Touch,
        Query : Query,

        events : {
            TouchEvent : TouchEvent,
            GameObjectEvent : GameObjectEvent
        }
    };
});
define('wozllajs/build/annotation/$Component',[
    './../../annotation/Annotation'
], function(Annotation) {

    return Annotation.define('$Component', {
        id : {
            type : 'string',
            default: null
        },
        constructor : {
            type : 'function',
            default : null
        }
    });

});
define('wozllajs/build/findComponentConstructor',[
    './annotation/$Component'
], function($Component) {

    return function(id) {
        var construct;
        var all = $Component.allModule();
        var i, len, $componentAnno;
        for(i=0,len=all.length; i<len; i++) {
            $componentAnno = all[i];
            construct = $componentAnno.constructor;
            if($componentAnno.id === id) {
                break;
            }
            if(construct.prototype.alias === id) {
                break;
            }
        }
        return construct;
    };
});
define('wozllajs/build/buildComponent',[
    './annotation/$Component',
    './findComponentConstructor'
], function($Component, findComponentConstructor) {

    return function(componentData) {
        var compCtor, properties, comp;
        compCtor = findComponentConstructor(componentData.id);
        properties = componentData.properties;
        comp = new compCtor();
        comp.properties = properties || {};
        return comp;
    };

});
define('wozllajs/build/buildObject',[
    './buildComponent',
    './../core/GameObject'
], function(buildComponent, GameObject) {

    function buildObject(objData) {
        if(buildObject.proxy) {
            return buildObject.proxy(objData);
        }

        var i, len, children = objData.children, components = objData.components;
        var obj = new GameObject({ id : objData.name });
        obj.setActive(objData.active);
        obj.setActive(objData.visible);
        for(i=0,len=children.length; i<len; i++) {
            obj.addObject(buildObject(children[i]));
        }
        for(i=0,len=components.length; i<len; i++) {
            obj.addComponent(buildComponent(components[i]));
        }
        obj.transform.applyTransform(objData.transform);
        return obj;
    }

    buildObject.proxy = null;

    return buildObject;

});
define('wozllajs/build/traverseObject',[
    './../promise'
], function(Promise) {

    function traverseObject(obj, callback) {
        var children, i, len, child;
        children = obj.getChildren();
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            callback && callback(child);
            traverseObject(child, callback);
        }
    }

    return traverseObject;
});
define('wozllajs/build/annotation/$Resource',[
    './../../annotation/Annotation'
], function(Annotation) {

    return Annotation.define('$Resource', {
        property : {
            type : 'string',
            default : null
        }
    });

});
define('wozllajs/build/annotation/$Query',[
    './../../annotation/Annotation'
], function(Annotation) {

    return Annotation.define('$Query', {
        property : {
            type : 'string',
            default : null
        }
    });

});
define('wozllajs/build/initObjData',[
    './../promise',
    './../core/Component',
    './../preload/LoadQueue',
    './buildObject',
    './traverseObject',
    './annotation/$Resource',
    './annotation/$Query'
], function(Promise, Component, LoadQueue, buildObject, traverseObject, $Resource, $Query) {

   return function(result) {
       var p = new Promise();
       var obj, resources = [], resourceInjectComponentMap = {};
       obj = buildObject(result);
       var start = Date.now();
       traverseObject(obj, function(o) {
           var i, len, j, len2, comp, components, $querys, $query, expr, item, id, property,
               $resource, $resources;
           components = o.getComponents(Component);
           for(i=0,len=components.length; i<len; i++) {
               comp = components[i];
               $querys = $Query.forModule(comp.constructor);
               for(j=0,len2=$querys.length; j<len2; j++) {
                   $query = $querys[j];
                   property = $query.property;
                   if(comp.properties.hasOwnProperty(property)) {
                       expr = comp.properties[property];
                       if(!(comp.properties[property] = o.query(expr))) {
                           throw new Error('Cant found by expression ' + expr);
                       }
                   } else {
                       throw new Error('Cant found property "' + $query.property + '" in component alias=' + comp.alias);
                   }
               }
               $resources = $Resource.forModule(comp.constructor);
               for(j=0,len2=$resources.length; j<len2; j++) {
                   $resource = $resources[j];
                   if(comp.properties.hasOwnProperty($resource.property)) {
                       item = comp.properties[$resource.property];
                       resources.push(item);
                       id = item.id || item.src || item;
                       resourceInjectComponentMap[id] = resourceInjectComponentMap[id] || [];
                       resourceInjectComponentMap[id].push({
                           property : $resource.property,
                           component : comp
                       });
                   }
               }
           }
       });
       LoadQueue.load(resources).then(function(result) {
           var id, i, len, comps, c, r;
           for(id in result) {
               r = result[id];
               comps = resourceInjectComponentMap[id];
               if(comps) {
                   for(i=0,len=comps.length; i<len; i++) {
                       c = comps[i];
                       c.component.properties[c.property] = r;
                   }
                   delete resourceInjectComponentMap[id];
               } else {
                   console.log('[Warn] maybe some error here');
               }
           }
           for(id in resourceInjectComponentMap) {
               console.log('[Warn] Unable to inject property "' + resourceInjectComponentMap[id].property +
                   '" in component alias=' + resourceInjectComponentMap[id].component.alias);

           }
           console.log('annotation inject cost ' + (Date.now()-start) + 'ms');
           obj.init();
           p.done(obj);
       });
       return p;
   }

});
define('wozllajs/build/loadAndInitObjFile',[
    './../promise',
    './../core/Component',
    './../preload/LoadQueue',
    './buildObject',
    './traverseObject',
    './annotation/$Resource',
    './annotation/$Query',
    './initObjData'
], function(Promise, Component, LoadQueue, buildObject, traverseObject, $Resource, $Query, initObjData) {

    return function(filePath, cached) {
        var p = new Promise();
        //TODO promise join
        LoadQueue.load({ id: filePath, src: filePath, type: 'json' }).then(function(result) {
            !cached && LoadQueue.remove(filePath);
            initObjData(result[filePath]).then(function(obj) {
                p.done(obj);
            });
        });
        return p;
    }
});
define('wozllajs/build',[
    './build/buildObject',
    './build/buildComponent',
    './build/findComponentConstructor',
    './build/traverseObject',
    './build/initObjData',
    './build/loadAndInitObjFile',
    './build/annotation/$Component',
    './build/annotation/$Query',
    './build/annotation/$Resource'
], function(buildObject, buildComponent, findComponentConstructor, traverseObject, initObjData, loadAndInitObjFile, $Component, $Query, $Resource) {

    return {
        buildObject : buildObject,
        buildComponent : buildComponent,
        findComponentConstructor: findComponentConstructor,
        traverseObject : traverseObject,
        initObjData: initObjData,
        loadAndInitObjFile : loadAndInitObjFile,
        annotation : {
            $Component : $Component,
            $Query : $Query,
            $Resource : $Resource
        }
    }
});
// proxy define
(function() {

    var originDefine = define;

    define = function() {
        var i, len;
        var factory;
        var args = Array.prototype.slice.call(arguments);
        for(i=0,len=args.length; i<len; i++) {
            if(typeof args[i] === 'function') {
                factory = args[i];
                args[i] = function() {
                    var exports;
                    if(define.proxy) {
                        exports = define.proxy(factory, arguments, this);
                    } else {
                        exports = factory.apply(this, arguments);
                    }
                    return exports;
                };
                break;
            }
        }
        return originDefine.apply(this, args);
    }

})();

define('wozllajs',[
    './wozllajs/var',
    './wozllajs/promise',
    './wozllajs/math',
    './wozllajs/annotation',
    './wozllajs/ajax',
    './wozllajs/events',
    './wozllajs/preload',
    './wozllajs/assets',
    './wozllajs/core',
    './wozllajs/build'
], function(wozllajs, proxyDefine, Promise) {

    wozllajs.Promise = Promise;
    // export modules
    var modules = wozllajs.slice(arguments, 3);
    var i, len, m, p;
    for(i=0,len=modules.length; i<len; i++) {
        m = modules[i];
        for(p in m) {
            wozllajs[p] = m[p];
        }
    }

    return window.wozllajs = wozllajs;
});