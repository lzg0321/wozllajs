define([
    './buildComponent',
    './../core/GameObject'
], function(buildComponent, GameObject) {

    function buildObject(objData) {
        if(buildObject.proxy) {
            return buildObject.proxy(objData);
        }

        var i, len, children = objData.children, components = objData.components;
        var obj = new GameObject({ id : objData.name });
        obj.setActive(objData.active);
        obj.setActive(objData.visible);
        for(i=0,len=children.length; i<len; i++) {
            obj.addObject(buildObject(children[i]));
        }
        for(i=0,len=components.length; i<len; i++) {
            obj.addComponent(buildComponent(components[i]));
        }
        obj.transform.applyTransform(objData.transform);
        return obj;
    }

    buildObject.proxy = null;

    return buildObject;

});