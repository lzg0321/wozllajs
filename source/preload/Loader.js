define([
    './../wozllajs'
], function(W) {

    var Loader = function(item) {
        this._item = item;
    };

    var p = Loader.prototype;

    p.load = function() {};

    return Loader;
});