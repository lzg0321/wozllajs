this.wozllajs = this.wozllajs || {};

(function() {

    var TouchEvent = function(x, y, type, nativeEvent) {
        this.x = x;
        this.y = y;
        this.nativeEvent = nativeEvent;
        this.type = type;
    };

    wozllajs.TouchEvent = TouchEvent;

})();