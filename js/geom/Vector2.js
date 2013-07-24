
WozllaJS.define('Vector2', function($) {

    function Vector2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Vector2.kEpsilon = 0.000001;

    Vector2.prototype = {

        x : 0,

        y : 0,

        set : function(x, y) {

        },

        normalize : function() {

        }
    };

    return Vector2;
});