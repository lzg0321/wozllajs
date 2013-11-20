define(function(require, exports) {

	var loader = require('./loader');
	var Component = require('../core/Component');
	var GameObject = require('../core/GameObject');

	exports.buildGameObject = function(objData) {
		var i, len, comp;
		var gameObject, children, components;
		gameObject = new GameObject({ name : objData.name });
		gameObject.setActive(objData.active);
		gameObject.setActive(objData.visible);
		gameObject.setWidth(objData.width || 0);
		gameObject.setHeight(objData.height || 0);
		gameObject.setInteractive(objData.interactive);
		gameObject.transform.applyTransform(objData.transform);
		children = objData.children;
		components = objData.components;
		for(i=0,len=children.length; i<len; i++) {
			gameObject.addObject(exports.buildGameObject(children[i]));
		}
		for(i=0,len=components.length; i<len; i++) {
			comp = exports.buildComponent(components[i]);
			if(comp) {
				gameObject.addComponent(comp);
			}
		}
		return gameObject;
	};

	exports.buildComponent = function(componentData) {
		var compCtor, properties, comp;
		compCtor = Component.getConstructor(componentData.id);
		properties = componentData.properties;
		if(compCtor) {
			comp = new compCtor();
			comp.properties = {};
			if(properties) {
				for(var i in properties) {
					comp.properties[i] = properties[i];
				}
			}
		}
		return comp;
	};

	exports.initObjectData = function(objData) {

	};

	exports.loadObjFile = function(filePath) {
		return loader.load({
			id : filePath,
			src : filePath,
			type : 'json'
		});
	};

	exports.loadAndInitObjFile = function(filePath) {
		return exports.loadObjFile(filePath).then(function() {
			var objData = loader.get(filePath);
			var obj = exports.buildGameObject(objData);
			loader.remove(filePath);
			return obj;
		});
	};

});