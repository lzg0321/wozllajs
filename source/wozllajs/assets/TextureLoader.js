define([
    './../var',
    './../ajax',
    './../promise',
    './Texture',
    './../preload/Loader',
    './../preload/LoadQueue',
    './../preload/ImageLoader'
], function(W, ajax, Promise, Texture, Loader, LoadQueue, ImageLoader) {

    var TextureLoader = function() {
        Loader.apply(this, arguments);
    };

    var p = W.inherits(TextureLoader, Loader);

    p.load = function() {
        var src = this._item['src'];
        var jsonSrc = src.replace('.tt', '.json');
        var imageSrc = src.replace('.tt', '.png');
        return Promise.wait(ajax.getJSON(jsonSrc), ImageLoader.loadSrc(imageSrc)).then(function(ajaxResult, image) {
            return new Texture(image, ajaxResult[0].frames);
        });
    };

    LoadQueue.registerLoader('tt', TextureLoader);

    return TextureLoader;
});