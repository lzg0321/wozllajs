define([
    './annotation/$Component'
], function($Component) {

    function findComponentConstructor(id) {
        var construct;
        var all = $Component.allModule();
        var i, len, $componentAnno;
        for(i=0,len=all.length; i<len; i++) {
            $componentAnno = all[i];
            construct = $componentAnno.constructor;
            if($componentAnno.id === id) {
                break;
            }
        }
        return construct;
    }

    return function(componentData) {
        var compCtor, properties, comp;
        compCtor = findComponentConstructor(componentData.id);
        properties = componentData.properties;
        comp = new compCtor();
        comp.applyProperties(properties);
        return comp;
    };

});