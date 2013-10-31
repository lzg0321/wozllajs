define([
    './build/buildObject',
    './build/buildComponent'
], function(buildObject, buildComponent) {

    return {
        buildObject : buildObject,
        buildComponent : buildComponent
    }
});