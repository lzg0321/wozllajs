define(function(require) {

    var Objects = require('../utils/Objects');
    var uniqueKey = require('../utils/uniqueKey');
    var EventTarget = require('../events/EventTarget');
    var GameObjectEvent = require('./events/GameObjectEvent');
    var Transform = require('./Transform');

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

		this.name = params.name;
		this.UID = uniqueKey();
		this.transform = new Transform({ gameObject: this });
		this._parent = null;
		this._children = [];
		this._childrenMap = {};
	};

	var p = Objects.inherits(AbstractGameObject, EventTarget);

	p.setName = function(name) {
		if(this._parent) {
			delete this._parent._childrenMap[this.name];
			this._parent._childrenMap[name] = this;
		}
		this.name = name;
	};

	p.getParent = function() {
		return this._parent;
	};

	p.getPath = function(seperator) {
		var o = this;
		var path = [];
		while(o && !o.isStage) {
			path.unshift(o.name);
			o = o._parent;
		}
		return path.join(seperator || '/');
	};

	p.getStage = function() {
		var o = this;
		while(o && !o.isStage) {
			o = o._parent;
		}
		return o.isStage ? o : null;
	};

	p.getChildren = function() {
		return this._children.slice();
	};

	p.sortChildren = function(func) {
		this._children.sort(func);
		this.dispatchEvent(new GameObjectEvent({
			type : GameObjectEvent.CHANGED,
			bubbles : false
		}));
	};

	p.getObjectByName = function(name) {
		return this._childrenMap[name];
	};

	p.addObject = function(obj) {
		this._childrenMap[obj.name] = obj;
		this._children.push(obj);
		obj._parent = this;
		this.dispatchEvent(new GameObjectEvent({
			type : GameObjectEvent.ADDED,
			bubbles : false,
			child : obj
		}));
	};

	p.insertObject = function(obj, index) {
		this._childrenMap[obj.name] = obj;
		this._children.splice(index, 0, obj);
		obj._parent = this;
		this.dispatchEvent(new GameObjectEvent({
			type : GameObjectEvent.ADDED,
			bubbles : false,
			child : obj
		}));
	};

	p.insertBefore = function(obj, objOrName) {
		var i, len, child;
		var index = 0;
		for(i=0,len=this._children.length; i<len; i++) {
			child = this._children[i];
			if(child === objOrName || child.name === objOrName) {
				index = i;
				break;
			}
		}
		this.insertObject(obj, index);
	};

	p.insertAfter = function(obj, objOrName) {
		var i, len, child;
		var index = this._children.length;
		for(i=0,len=this._children.length; i<len; i++) {
			child = this._children[i];
			if(child === objOrName || child.name === objOrName) {
				index = i;
				break;
			}
		}
		this.insertObject(obj, index+1);
	};

	p.removeObject = function(objOrName) {
		var children = this._children;
		var obj = typeof objOrName === 'string' ? this._childrenMap[objOrName] : objOrName;
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
			delete this._childrenMap[obj.name];
			obj._parent = null;
			this.dispatchEvent(new GameObjectEvent({
				type : GameObjectEvent.REMOVED,
				bubbles : false,
				child : obj
			}));
		}
		return idx;
	};

	p.remove = function(params) {
		this._parent && this._parent.removeObject(this);
		this._parent = null;
	};

	p.removeAll = function(params) {
		// event ?
		this._children = [];
		this._childrenMap = {};
	};

	p.findObjectByName = function(name) {
		var i, len, children;
		var obj = this.getObjectByName(name);
		if(!obj) {
			children = this._children;
			for(i=0,len=children.length; i<len; i++) {
				obj = children[i].findObjectByName(name);
				if(obj) break;
			}
		}
		return obj;
	};

	p.findObjectByPath = function(path, seperator) {
		var i, len;
		var paths = path.split(seperator || '/');
		var obj = this.findObjectByName(paths[0]);
		if(obj) {
			for(i=1, len=paths.length; i<len; i++) {
				obj = obj.getObjectByName(paths[i]);
				if(!obj) return null;
			}
		}
		return obj;
	};

	return AbstractGameObject;

});