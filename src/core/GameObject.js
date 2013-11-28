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
				e.removeListener();
				delete idMap[me.id];
			});
		}
	};

	Objects.inherits(GameObject, CachableGameObject);

	GameObject.getById = function(id) {
		return idMap[id];
	};

	return GameObject;
});