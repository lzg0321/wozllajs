define([
    './../promise'
], function(Promise) {

    function traverseObject(obj, callback) {
        var children, i, len, child;
        children = obj.getChildren();
        for(i=0,len=children.length; i<len; i++) {
            child = children[i];
            callback && callback(child);
            traverseObject(child, callback);
        }
    }

    return traverseObject;
});