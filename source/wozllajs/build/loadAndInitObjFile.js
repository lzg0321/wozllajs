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

    return function(filePath, cached) {
        var p = new Promise();
        //TODO promise join
        LoadQueue.load({ id: filePath, src: filePath, type: 'json' }).then(function() {
            var result = LoadQueue.get(filePath);
            !cached && LoadQueue.remove(filePath);
            initObjData(result).then(function(obj) {
                p.done(obj);
            });
        });
        return p;
    }
});