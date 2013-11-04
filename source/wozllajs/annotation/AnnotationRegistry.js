define([
    './../var/uniqueKey'
], function(uniqueKey) {

    var registry = {};

    function createId() {
        return '__module_annotation_' + uniqueKey()
    }

    function getModuleKey() {
        return '__module_annotation_key';
    }

    return {
        getAll : function($annoType) {
            var arr = [];
            var anno;
            for(var mKey in registry) {
                anno = registry[mKey];
                if(anno) {
                    arr = arr.concat(anno.getAnnotation($annoType));
                }
            }
            return arr;
        },
        get : function(module) {
            return registry[module[getModuleKey()]];
        },
        register : function(module, annotation) {
            var id = createId();
            registry[id] = annotation;
            module[getModuleKey()] = id;
        },
        unregister : function(module) {
            delete registry[module[getModuleKey()]];
        }
    }

});