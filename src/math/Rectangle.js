define(function() {

	/**
	 * @class wozllajs.math.Rectangle
	 * @constructor
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 */
    var Rectangle = function(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 0;
        this.height = h || 0;
    };

    var p = Rectangle.prototype;

	/**
	 * get top
	 * @returns {int}
	 */
    p.top = function() {
        return this.y;
    };

	/**
	 * get left
	 * @returns {int}
	 */
    p.left = function() {
        return this.x;
    };

	/**
	 * get right
	 * @returns {int}
	 */
    p.right = function() {
        return this.x + this.width;
    };

	/**
	 * get bottom
	 * @returns {int}
	 */
    p.bottom = function() {
        return this.y + this.height;
    };

	/**
	 * 判断是否包含某个点
	 * @param x
	 * @param y
	 * @returns {boolean}
	 */
    p.contains = function(x, y) {
        return this.x <= x && this.y <= y && this.x + this.width > x && this.y + this.height > y;
    };

	/**
	 * 判断是否包含某个点
	 * @param {Point} point
	 * @returns {boolean}
	 */
    p.containsPoint = function(point) {
        return this.contains(point.x, point.y);
    };

	/**
	 * 判断是否与另一个矩形重叠
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @returns {boolean}
	 */
    p.intersects = function(x, y, w, h) {
        return this.x < x+w && this.x+this.width > x && this.y < y+h && this.y+this.height > y;
    };

	/**
	 * 判断是否与另一个矩形重叠
	 * @param {Rectangle} r
	 * @returns {boolean}
	 */
    p.intersectRect = function(r) {
        return this.intersects(r.x, r.y, r.width, r.height);
    };

	/**
	 * js中最大的矩形
	 * @static
	 * @type {wozllajs.math.Rectangle}
	 * @readonly
	 */
    Rectangle.MAX_RECT = new Rectangle(Number.MIN_VALUE, Number.MIN_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);

    return Rectangle;

});