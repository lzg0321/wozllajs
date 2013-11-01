define([
    './build/buildObject',
    './build/buildComponent',
    './build/traverseObject',
    './build/loadAndInitObjFile'
], function(buildObject, buildComponent, traverseObject, loadAndInitObjFile) {

    return {
        buildObject : buildObject,
        buildComponent : buildComponent,
        traverseObject : traverseObject,
        loadAndInitObjFile : loadAndInitObjFile
    }
});