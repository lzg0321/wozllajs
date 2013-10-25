define([
    'require',
    'module',
    './../wozllajs',
    './../events/EventTarget',
    './Transform',
    './../annotation/$Inject'
], function(require, module, W, EventTarget, Transform, $Inject) {

    $Inject({
        type : Object,
        value : 'Login'
    });

    /**
     *
     * @name AbstractGameObject
     * @class AbstractGameObject 类是所以游戏对象的基类，其定义了树形结构，并继承 EventTarget 以实现游戏中的事件调度
     * @constructor
     * @abstract
     * @extends EventTarget
     * @param {Object} params
     * @param {String} params.id
     */
    var AbstractGameObject = function(params) {
        EventTarget.apply(this, arguments);

        this.id = params.id;
        this.UID = W.uniqueKey();
        this.transform = new Transform({ gameObject: this });
        this._parent = null;
        this._children = [];
        this._childrenMap = {};
    };

    var p = AbstractGameObject.prototype;

    p.setId = function(id) {
        if(this._parent) {
            delete this._parent._childrenMap[this.id];
            this._parent._childrenMap[id] = this;
        }
        this.id = id;
    };

    p.getParent = function() {
        return this._parent;
    };

    p.getPath = function(seperator) {
        var o = this;
        var path = [];
        while(o) {
            path.unshift(o.id);
            o = o._parent;
        }
        return path.join(seperator || '.');
    };

    p.getStage = function() {
        return require('./Stage').root;
    };

    p.getChildren = function() {
        return this._children.slice();
    };

    p.sortChildren = function(func) {
        this._children.sort(func);
    };

    p.getObjectById = function(id) {
        return this._childrenMap[id];
    };

    p.addObject = function(obj) {
        this._childrenMap[obj.id] = obj;
        this._children.push(obj);
        obj._parent = this;
    };

    p.insertObject = function(obj, index) {
        this._childrenMap[obj.id] = obj;
        this._children.splice(index, 0, obj);
        obj._parent = this;
    };

    p.insertBefore = function(obj, objOrId) {
        var i, len, child;
        var index = 0;
        for(i=0,len=this._children.length; i<len; i++) {
            child = this._children[i];
            if(child === objOrId || child.id === objOrId) {
                index = i;
                break;
            }
        }
        this.insertObject(obj, index);
    };

    p.insertAfter = function(obj, objOrId) {
        var i, len, child;
        var index = this._children.length;
        for(i=0,len=this._children.length; i<len; i++) {
            child = this._children[i];
            if(child === objOrId || child.id === objOrId) {
                index = i;
                break;
            }
        }
        this.insertObject(obj, index+1);
    };

    p.removeObject = function(idOrObj) {
        var children = this._children;
        var obj = typeof idOrObj === 'string' ? this._childrenMap[idOrObj] : idOrObj;
        var idx = -1;
        var i, len;
        for(i=0,len=children.length; i<len; i++) {
            if(obj === children[i]) {
                idx = i;
                children.splice(idx, 1);
                break;
            }
        }
        if(idx !== -1) {
            delete this._childrenMap[obj.id];
            obj._parent = null;
            obj.transform.parent = null;
        }
        return idx;
    };

    p.remove = function(params) {
        this._parent && this._parent.removeObject(this);
        this._parent = null;
    };

    p.removeAll = function(params) {
        this._children = [];
        this._childrenMap = {};
    };

    p.findObjectById = function(id) {
        var i, len, children;
        var obj = this.getObjectById(id);
        if(!obj) {
            children = this._children;
            for(i=0,len=children.length; i<len; i++) {
                obj = children[i].findObjectById(id);
                if(obj) break;
            }
        }
        return obj;
    };

    p.findObjectByPath = function(path) {
        var i, len;
        var paths = path.split('.');
        var obj = this.findObjectById(paths[0]);
        if(obj) {
            for(i=1, len=paths.length; i<len; i++) {
                obj = obj.getObjectById(paths[i]);
                if(!obj) return null;
            }
        }
        return obj;
    };


    W.extend(AbstractGameObject, EventTarget);

    return AbstractGameObject;

});