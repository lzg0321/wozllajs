(function() {


    // global vars
    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(frameCall, intervalTime) {
            setTimeout(frameCall, intervalTime);
        };

    // Array

    Array.prototype.remove = function(obj) {
        var idx = this.indexOf(obj);
        if(idx !== -1) {
            this.splice(idx, 1);
        }
    };

    Array.prototype.indexOf = function(obj) {
        var i, len;
        for(i=0, len=this.length; i<len; i++) {
            if(this[i] === obj) {
                return i;
            }
        }
        return -1;
    }


});