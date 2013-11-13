define(function() {

    var Rectangle = function(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 0;
        this.height = h || 0;
    };

    var p = Rectangle.prototype;

    p.top = function() {
        return this.y;
    };

    p.left = function() {
        return this.x;
    };

    p.right = function() {
        return this.x + this.width;
    };

    p.bottom = function() {
        return this.y + this.height;
    };

    p.contains = function(x, y) {
        return this.x <= x && this.y <= y && this.x + this.width > x && this.y + this.height > y;
    };

    p.containsPoint = function(point) {
        return this.contains(point.x, point.y);
    };

    p.intersects = function(x, y, w, h) {
        return this.x < x+w && this.x+this.width > x && this.y < y+h && this.y+this.height > y;
    };

    p.intersectRect = function(r) {
        return this.intersects(r.x, r.y, r.width, r.height);
    };

    Rectangle.MAX_RECT = new Rectangle(Number.MIN_VALUE, Number.MIN_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);

    return Rectangle;

});