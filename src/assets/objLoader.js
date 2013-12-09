define(function(require, exports) {

	var loader = require('./loader');
	var Component = require('../core/Component');
	var GameObject = require('../core/GameObject');

	exports.buildGameObject = function(objData) {
		var i, len, comp;
		var gameObject, children, components;
		gameObject = new GameObject({
			name : objData.name,
			id: objData.gid,
			tags : objData.tags
		});
		gameObject.setActive(objData.active);
		gameObject.setVisible(objData.visible);
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

	exports.loadObjFile = function(filePath) {
		return loader.load({
			id : filePath,
			src : filePath,
			type : 'json'
		});
	};

	exports.loadAndInitObjFile = function(filePath, removeResource) {
		return exports.loadObjFile(filePath).then(function() {
			var objData = loader.get(filePath);
			var obj = exports.buildGameObject(objData);
			removeResource && loader.remove(filePath);
			return obj;
		});
	};

	exports.loadAndInitObjFileToObjs = function(filePath, exts, removeResource) {
		return exports.loadObjFile(filePath).then(function() {
			var objs = [];
			for (var i in exts) {
				var objData = loader.get(filePath);
				var obj = exports.buildGameObject(objData);
				obj.setName(objData.name + exts[i]);
				objs.push(obj);
			}
			removeResource && loader.remove(filePath);
			return [objs];
		});
	};

	//loadObjFiles loadAndInitObjFiles未经测试，正确性待考证。
	exports.loadObjFiles = function(filePaths) {
		var fileItems = [];
		for(var i in filePaths){
			fileItems.push({
				id: filePaths[i],
				src: filePaths[i],
				type: 'json'
			});
		}
		return loader.load(fileItems);
	};

	exports.loadAndInitObjFiles = function(filePaths, removeResource) {
		return exports.loadObjFiles(filePaths).then(function() {
			var objs = [];
			for(var i in filePaths){
				var objData = loader.get(filePaths[i]);
				var obj = exports.buildGameObject(objData);
				removeResource && loader.remove(filePaths[i]);
				objs.push(obj);
			}
			return [objs];
		});
	};

});