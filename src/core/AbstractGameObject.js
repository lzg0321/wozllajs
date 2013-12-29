define(function(require) {

    var Objects = require('../utils/Objects');
    var uniqueKey = require('../utils/uniqueKey');
    var EventTarget = require('../events/EventTarget');
    var GameObjectEvent = require('./events/GameObjectEvent');
    var Transform = require('./Transform');

	/**
	 * 	@class wozllajs.core.AbstractGameObject
	 * 	@extends wozllajs.events.EventTarget
	 * 		AbstractGameObject 类是所以游戏对象的基类.
	 * 		1. 定义了树形结构
	 * 		2. 继承 EventTarget 实现游戏中的事件调度
	 *
	 * 	@abstract
	 * 	@protected
	 * 	@constructor
	 * 		这是一个抽象的基类，不要直接使用
	 *  @param {Object} params
	 *  @param {string} params.name name of this object
	 *
	 */
	var AbstractGameObject = function(params) {
		EventTarget.apply(this, arguments);

		/**
		 *	unique id, using for query
		 * @type {string}
		 * @public @readonly
		 */
		this.id = params.id;
		/**
		 * @type {string}
		 * 	name of this object, 在树型结构中用来构成path
		 * @public
		 * @readonly
		 */
		this.name = params.name;

		/**
		 * 标签
		 * @type {tags|*}
		 */
		this.tags = params.tags;
		this.tagsHash = {};
		if(this.tags) {
			var tempTags = this.tags.split(' ');
			for(var i= 0,len=tempTags.length; i<len; i++) {
				this.tagsHash[tempTags[i]] = true;
			}
		}

		/**
		 * @type {int}
		 * 	唯一UID, 几乎没有用途
		 * @readonly
		 */
		this.UID = uniqueKey();

		/**
		 * @type {Transform}
		 * 	该属性定义了该gameObject的形状、位置、alpha
		 * @readonly
		 */
		this.transform = new Transform({ gameObject: this });

		/**
		 *
		 * @type {AbstractGameObject}
		 * 	parent object
		 * @protected
		 */
		this._parent = null;

		/**
		 * @type {Array}
		 *  children of this object
		 * @protected
		 */
		this._children = [];

		/**
		 *
		 * @type {object}
		 * 	It's a map for quickly search children of this game object
		 * @protected
		 */
		this._childrenMap = {};
	};

	var p = Objects.inherits(AbstractGameObject, EventTarget);

	/**
	 * 设置该object的name
	 * @param name
	 */
	p.setName = function(name) {
		if(this._parent) {
			delete this._parent._childrenMap[this.name];
			this._parent._childrenMap[name] = this;
		}
		this.name = name;
	};

	/**
	 * 判断是否有某个标签
	 * @param tag
	 * @returns {tags|*|tags|*|boolean}
	 */
	p.isTagged = function(tag) {
		return this.tagsHash[tag];
	};

	/**
	 * get parent
	 * @returns {null|AbstractGameObject}
	 */
	p.getParent = function() {
		return this._parent;
	};

	/**
	 * get tree path
	 * @param {string} [seperator=/]
	 * @returns {string}
	 */
	p.getPath = function(seperator) {
		var o = this;
		var path = [];
		while(o && !o.isStage) {
			path.unshift(o.name);
			o = o._parent;
		}
		return path.join(seperator || '/');
	};

	/**
	 * get stage
	 * @returns {wozllajs.core.Stage} 如果这个对象没有加入到stage中，返回null
	 */
	p.getStage = function() {
		var o = this;
		while(o && !o.isStage) {
			o = o._parent;
		}
		return o && o.isStage ? o : null;
	};

	p.indexInParent = function() {
		if(!this._parent) {
			return -1;
		}
		return this._parent.getChildIndex(this);
	};

	p.getChildIndex = function(child) {
		return this._children.indexOf(child);
	};

	/**
	 * get children
	 * @returns {Array}
	 */
	p.getChildren = function() {
		return this._children.slice();
	};

	/**
	 * sort children
	 * @param func sorter
	 */
	p.sortChildren = function(func) {
		this._children.sort(func);
		this.dispatchEvent(new GameObjectEvent({
			type : GameObjectEvent.CHANGED,
			bubbles : false
		}));
	};

	/**
	 * get child by name
	 * @param name
	 * @returns {null|AbstractGameObject}
	 */
	p.getObjectByName = function(name) {
		return this._childrenMap[name];
	};

	/**
	 * add child to this object
	 * @param obj {AbstractGameObject}
	 */
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

	/**
	 * insert child at index
	 * @param obj child game object
	 * @param index the position the child will be insert
	 */
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

	/**
	 * insert child before the child
	 * @param obj be inserted child
	 * @param objOrName relative child or it's name
	 */
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

	/**
	 * insert child after the relative child
	 * @param obj be inserted child
	 * @param objOrName relative child or it's name
	 */
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

	/**
	 * remove child
	 * @param objOrName the child be removed or it's name
	 * @returns {number} the position of removed child
	 */
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

	/**
	 * remove me from parent
	 */
	p.remove = function() {
		this._parent && this._parent.removeObject(this);
		this._parent = null;
	};

	/**
	 * remove all children
	 */
	p.removeAll = function() {
		// event ?
		this._children = [];
		this._childrenMap = {};
	};

	/**
	 * find child object by name
	 * @param name
	 * @returns {null|AbstractGameObject}
	 */
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

	/**
	 * find object by tree path
	 * @param path the path of find
	 * @param seperator the seperator of the param path
	 * @returns {null|AbstractGameObject}
	 */
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