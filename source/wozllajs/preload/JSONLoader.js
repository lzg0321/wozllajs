define([
    'require',
    './../var',
    './../promise',
    './Loader'
], function(require, W, Promise, Loader) {

    var JSONLoader = function() {
        Loader.apply(this, arguments);
    };

    var p = W.inherits(JSONLoader, Loader);

    p.load = function() {
        return W.getJSON(this._item['src']);
    };

    return JSONLoader;
});