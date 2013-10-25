define([
    'require',
    './../wozllajs',
    './../promise',
    './Loader'
], function(require, W, Promise, Loader) {

    var JSONLoader = function() {
        Loader.apply(this, arguments);
    };

    var p = JSONLoader.prototype;

    p.load = function() {
        return W.getJSON(this._item['src']);
    };

    W.extend(JSONLoader, Loader);

    return JSONLoader;
});