Class.define('wozlla.GameObject', {

    include : ['wozlla.Transform'],

    id : null,

    active : true,

    visible : true,

    parent : null,

    objects : null,

    objectMap : null,

    components : null,

    componentMap : null,

    initialize : function() {
        this.callParent(arguments);
        this.objects = [];
        this.objectMap = {};
        this.components = [];
        this.componentMap = {};
    },

    addObject : function(obj) {
        this.objectMap[obj.id] = obj;
        this.objects.push(obj);
        obj.parent = this;
    },

    removeObject : function(idOrObj) {
        var objects = this.objects;
        var id = typeof idOrObj === 'string' ? idOrObj : idOrObj.id;
        var idx, i, len;
        for(i=0,len=objects.length; i<len; i++) {
            if(objects[i].id === id) {
                idx = i;
                break;
            }
        }
        if(idx !== undefined) {
            objects.splice(idx, 1);
            delete this.objectMap[id];
        }
        return idx;
    },

    remove : function() {
        this.parent.removeObject(this);
        this.parent = null;
    },

    getObjectById : function(id) {
        return this.objectMap[id];
    },

    findObjectById : function(id) {
        var obj = this.getObjectById(id);
        if(!obj) {
            var objects = this.objects;
            var i, len;

            for(i=0,len=objects.length; i<len; i++) {
                obj = objects[i].findObjectById(id);
                if(obj) break;
            }
        }
        return obj;
    },

    findObjectByPath : function(path) {
        var paths = path.split('.');
        var pathRootObj = this.findObjectById(paths.shift());
        if(!pathRootObj) {
            return null;
        }
        var target = pathRootObj;
        while(paths.length > 0 && target) {
            target=target.getObjectById(paths.shift())
        }
        return target;
    }

});