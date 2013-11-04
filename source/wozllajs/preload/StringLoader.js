define([
    'require',
    './../var',
    './../promise',
    './Loader'
], function(require, W, Promise, Loader) {

    var StringLoader = function() {
        Loader.apply(this, arguments);
    };

    var p = W.inherits(StringLoader, Loader);

    p.load = function() {
        return W.get(this._item['src']);
    };

    return StringLoader;
});