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
