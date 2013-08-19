wozllajs.define('wozlla.AbstractGameObject', {

    include : ['wozlla.Transform'],

    id : null,

    transform : null,

    active : true,

    visible : true,

    parent : null,

    _objects : null,

    _objectMap : null,

    _components : null,

    _componentMap : null,

    initialize : function() {
        this.callParent(arguments);
        this.transform = this;
        this._objects = [];
        this._objectMap = {};
        this._components = [];
        this._componentMap = {};
    },

    setActive : function(active) {
        this.active = active;
    },

    setVisible : function(visible) {
        this.visible = visible;
    },

    addObject : function(obj) {
        this._objectMap[obj.id] = obj;
        this._objects.push(obj);
        obj.parent = this;
    },

    removeObject : function(idOrObj) {
        var objects = this._objects;
        var obj = typeof idOrObj === 'string' ? this._objectMap[idOrObj] : idOrObj;
        var idx = this._objects.remove(obj);
        if(idx !== -1) {
            objects.splice(idx, 1);
            delete this._objectMap[obj.id];
        }
        return idx;
    },

    remove : function() {
        this.parent.removeObject(this);
        this.parent = null;
    },

    getObjectById : function(id) {
        return this._objectMap[id];
    },

    findObjectById : function(id) {
        var obj = this.getObjectById(id);
        if(!obj) {
            var objects = this._objects;
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
    },

    addComponent : function(component) {
        var _this = this;
        this._components.push(component);
        this._componentMap[component.id] = component;
        component.setGameObject(this);
    },

    removeComponent : function(component) {
        var i, len, idx;
        component.destroy && component.destroy();
        idx = this._components.remove(component);
        delete this._componentMap[component.id];
        return idx;
    },

    getComponent : function(id) {
        return this._componentMap[id];
    }

});