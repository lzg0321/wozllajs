this.wozllajs = this.wozllajs || {};

this.wozllajs.geom = {
    vectorLength : function(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    },
    vectorNomalize : function(v) {
        var len = Math.sqrt(v.x * v.x + v.y * v.y);
        if (len <= Number.MIN_VALUE) {
            return 0.0;
        }
        var invL = 1.0 / len;
        v.x *= invL;
        v.y *= invL;
        return len;
    },
    rectIntersection : function(a, b) {
        return a.x < b.x + b.width &&
            b.x < a.x + a.width &&
            a.y < b.y + b.height &&
            b.y < a.y + a.height;
    },
    rectIntersection2 : function(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw &&
            bx < ax + aw &&
            ay < by + bh &&
            by < ay + ah;
    },
    pointInRect : function(p, r) {
        return r.x <= p.x && r.x + r.width >= p.x &&
            r.y <= p.y && r.y + r.height >= p.y;
    },
    pointInRect2 : function(x, y, rx, ry, rw, rh) {
        return rx <= x && rx + rw >= x &&
            ry <= y && ry + rh >= y;
    }
};