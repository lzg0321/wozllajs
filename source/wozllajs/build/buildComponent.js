define([
    './annotation/$Component',
    './findComponentConstructor'
], function($Component, findComponentConstructor) {

    return function(componentData) {
        var compCtor, properties, comp;
        compCtor = findComponentConstructor(componentData.id);
        properties = componentData.properties;
        if(compCtor) {
            comp = new compCtor();
            comp.properties = {};
            if(properties) {
                for(var i in properties) {
                    comp.properties = properties[i];
                }
            }
        }
        return comp;
    };

});