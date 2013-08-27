this.wozllajs = this.wozllajs || {};

(function() {
	"use strict";

	function Collider(params) {
		this.initialize(params);
	}

	var p = Collider.prototype = Object.create(wozllajs.Component.prototype);

	p.type = wozllajs.Component.COLLIDER;

	p.collide = function(collider) {
		throw new Error('a subclass of Collider must implements method "collide"');
	};

	wozllajs.Collider = Collider;
	
})();