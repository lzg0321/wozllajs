define([
    'require',
    './../var',
    './../promise',
    './Loader'
], function(require, W, Promise, Loader) {

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

    var p = ImageLoader.prototype;

    p.load = function() {
        return ImageLoader.loadSrc(this._item['src']);
    };

    W.extend(ImageLoader, Loader);

    return ImageLoader;
});