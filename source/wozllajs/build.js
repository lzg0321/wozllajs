define([
    './build/buildObject',
    './build/buildComponent',
    './build/findComponentConstructor',
    './build/traverseObject',
    './build/initObjData',
    './build/loadAndInitObjFile',
    './build/annotation/$Component',
    './build/annotation/$Query',
    './build/annotation/$Resource'
], function(buildObject, buildComponent, findComponentConstructor, traverseObject, initObjData, loadAndInitObjFile, $Component, $Query, $Resource) {

    return {
        buildObject : buildObject,
        buildComponent : buildComponent,
        findComponentConstructor: findComponentConstructor,
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