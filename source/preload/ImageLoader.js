define([
    'require',
    './../var',
    './../promise',
    './Loader',
    './AsyncImage'
], function(require, W, Promise, Loader, AsyncImage) {

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

    ImageLoader.loadAsyncImage = function(src) {
        return ImageLoader.loadSrc(src).then(function(image) {
            return new AsyncImage(image);
        });
    };

    var p = ImageLoader.prototype;

    p.load = function() {
        return ImageLoader.loadAsyncImage(this._item['src']);
    };

    W.extend(ImageLoader, Loader);

    return ImageLoader;
});