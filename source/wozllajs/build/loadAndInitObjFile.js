define([
    './../promise',
    './../core/Component',
    './../preload/LoadQueue',
    './buildObject',
    './traverseObject',
    './annotation/$Resource',
    './annotation/$Query',
    './initObjData'
], function(Promise, Component, LoadQueue, buildObject, traverseObject, $Resource, $Query, initObjData) {

    var refRegex = /"\[(.*?)\]"/ig;

    function traverse(objData, callback) {
        var child;
        var children = objData.children;
        for(var i= 0, len=children.length; i<len; i++) {
            child = children[i];
            callback(child);
            traverse(child, callback);
        }
    }

    return function(filePath, cached) {
        var p = new Promise();
        //TODO promise join
        LoadQueue.load({ id: filePath, src: filePath, type: 'json' }).then(function() {
            var refs = [];
            var result = LoadQueue.get(filePath);
            !cached && LoadQueue.remove(filePath);

            traverse(result, function(objData) {
                var matches;
                while(matches = refRegex.exec(objData.name)) {
                    refs.push({
                        id: matches[1],
                        src : matches[1],
                        type: 'json'
                    });
                }
            });

            if(refs.length === 0) {
                initObjData(result).then(function(obj) {
                    p.done(obj);
                });
                return;
            }

            LoadQueue.load(refs).then(function() {
                initObjData(result).then(function(obj) {
                    var i, len;
                    for(i=0,len=refs.length; i<len; i++) {
                        LoadQueue.remove(refs[i]);
                    }
                    p.done(obj);
                });
            });
        });
        return p;
    }
});