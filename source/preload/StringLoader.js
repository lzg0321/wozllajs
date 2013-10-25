define([
    'require',
    './../var',
    './../promise',
    './Loader'
], function(require, W, Promise, Loader) {

    var StringLoader = function() {
        Loader.apply(this, arguments);
    };

    var p = StringLoader.prototype;

    p.load = function() {
        return W.get(this._item['src']);
    };

    W.extend(StringLoader, Loader);

    return StringLoader;
});