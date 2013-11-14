define([
    './buildComponent',
    './../preload/LoadQueue',
    './../core/GameObject',
    './../var/isArray'
], function(buildComponent, LoadQueue, GameObject, isArray) {


    function buildObject(objData) {
        if(buildObject.proxy) {
            return buildObject.proxy(objData);
        }

        var comp;
        var i, len, j, len2, obj, children, components, builded;
        var matches;
        var refRegex = /\[(.*?)\]/g;
        if(matches = refRegex.exec(objData.name)) {
            var arr = [];
            var refObjData = LoadQueue.get(matches[i]);
            if(!refObjData) {
                console.log('[Warn] unloaded ref ' + matches[i]);
                return null;
            }
            children = refObjData.children;
            for(i=0,len=children.length; i<len; i++) {
                arr.push(buildObject(children[i]));
            }
            return children;
        }

        children = objData.children;
        components = objData.components;

        obj = new GameObject({ id : objData.name });
        obj.setActive(objData.active);
        obj.setActive(objData.visible);
        obj.setWidth(objData.width || 0);
        obj.setHeight(objData.height || 0);
        obj.setInteractive(objData.interactive);
        for(i=0,len=children.length; i<len; i++) {
            builded = buildObject(children[i]);
            if(isArray(builded)) {
                for(j=0, len2=builded.length; j<len2; j++) {
                    obj.addObject(builded[j]);
                }
            } else if(builded) {
                obj.addObject(builded);
            }
        }
        for(i=0,len=components.length; i<len; i++) {
            comp = buildComponent(components[i]);
            if(comp) {
                obj.addComponent(comp);
            }
        }
        obj.transform.applyTransform(objData.transform);
        return obj;
    }

    buildObject.proxy = null;

    return buildObject;

});