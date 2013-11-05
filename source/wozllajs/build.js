define([
    './build/buildObject',
    './build/buildComponent',
    './build/traverseObject',
    './build/loadAndInitObjFile',
    './build/annotation/$Component',
    './build/annotation/$Query',
    './build/annotation/$Resource'
], function(buildObject, buildComponent, traverseObject, loadAndInitObjFile, $Component, $Query, $Resource) {

    return {
        buildObject : buildObject,
        buildComponent : buildComponent,
        traverseObject : traverseObject,
        loadAndInitObjFile : loadAndInitObjFile,
        annotation : {
            $Component : $Component,
            $Query : $Query,
            $Resource : $Resource
        }
    }
});