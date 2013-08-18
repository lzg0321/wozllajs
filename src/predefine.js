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
    var i, len;
    for(i=0, len=this.length; i<len; i++) {
        if(this[i] === obj) {
            this.splice(i, 1);
            return i;
        }
    }
    return -1;
};
