define([
    './build/buildObject',
    './../wozllajs/build/buildComponent',
    './../wozllajs/build/traverseObject',
    './../wozllajs/build/loadAndInitObjFile'
], function(buildObject, buildComponent, traverseObject, loadAndInitObjFile) {

    return {
        buildObject : buildObject,
        buildComponent : buildComponent,
        traverseObject : traverseObject,
        loadAndInitObjFile : loadAndInitObjFile
    }
});