define([
    './annotation/$Component',
    './findComponentConstructor'
], function($Component, findComponentConstructor) {

    return function(componentData) {
        var compCtor, properties, comp;
        compCtor = findComponentConstructor(componentData.id);
        properties = componentData.properties;
        comp = new compCtor();
        comp.properties = properties || {};
        return comp;
    };

});