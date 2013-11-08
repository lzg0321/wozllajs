define([
    './build/buildObject',
    './build/buildComponent',
    './build/traverseObject',
    './build/initObjData',
    './build/loadAndInitObjFile',
    './build/annotation/$Component',
    './build/annotation/$Query',
    './build/annotation/$Resource'
], function(buildObject, buildComponent, traverseObject, initObjData, loadAndInitObjFile, $Component, $Query, $Resource) {

    return {
        buildObject : buildObject,
        buildComponent : buildComponent,
        traverseObject : traverseObject,
        initObjData: initObjData,
        loadAndInitObjFile : loadAndInitObjFile,
        annotation : {
            $Component : $Component,
            $Query : $Query,
            $Resource : $Resource
        }
    }
});