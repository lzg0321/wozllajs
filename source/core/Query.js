define([
    'require',
    './Component'
], function(require, Component) {

    /**
     * Query(gameObject, './text/path:renderer.Image');
     *
     */

    /**
     * 分组:
     *  1. relative position / absolute position
     *  4. path
     *  9. component alias
     */
    var queryRegex = /^((\.\/)|(\/))?(([a-zA-Z0-9]+?)|(([a-zA-Z0-9]+?\/)+?[a-zA-Z0-9]+?))(:([a-zA-Z0-9\.\-]+?))?$/;

    var Query = function(expression, context) {
        context = context || require('./Stage').root;
        if(!context) {
            throw new Error('Cant found context for query');
        }
        var result = queryRegex.exec(expression);
        var startPos = result[1] || './';
        var path = result[4];
        var compAlias = result[9];
        var find;
        if(startPos === './') {
            find = context.findObjectByPath(path);
        } else {
            while(context._parent) {
                context = context._parent;
            }
            find = context.findObjectByPath(path);
        }
        if(find && compAlias) {
            find = Query.findComponent(find, compAlias);
        }
        return find;
    };

    Query.findComponent = function(obj, param) {
        var doFind =
            (typeof param === 'string' && param.indexOf('x-') === 0) ||
                (typeof param === 'function' && Component.prototype.isPrototypeOf &&
                    Component.prototype.isPrototypeOf(param.prototype));
        return doFind && obj.getComponent(param);
    };

    return Query;
});