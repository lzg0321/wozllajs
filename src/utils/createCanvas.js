define(function() {

    return function(width, height, screenCanvas) {
        var canvas = document.createElement(navigator.isCocoonJS && screenCanvas? 'screencanvas': 'canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };
});