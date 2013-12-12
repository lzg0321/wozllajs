define(function(require) {

	var idMap = {};

	var Objects = require('../utils/Objects');
    var CachableGameObject = require('./CachableGameObject');
	var GameObjectEvent = require('./events/GameObjectEvent');

	var GameObject = function() {
		var me = this;
		CachableGameObject.apply(this, arguments);
		if(this.id) {
			idMap[this.id] = this;
			this.addEventListener(GameObjectEvent.DESTROY, function(e) {
				if(e.target !== me) return;
				e.removeListener();
				delete idMap[me.id];
			});
		}
	};

	GameObject.idMap = idMap;

	Objects.inherits(GameObject, CachableGameObject);

	GameObject.getById = function(id) {
		return idMap[id];
	};

	return GameObject;
});