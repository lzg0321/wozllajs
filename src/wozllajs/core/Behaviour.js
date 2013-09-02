this.wozllajs = this.wozllajs || {};

(function() {
	"use strict";

	function Behaviour(params) {
		this.initialize(params);
	}

	var p = Behaviour.prototype = Object.create(wozllajs.Component.prototype);

	p.type = wozllajs.Component.BEHAVIOUR;

	p.update = function(camera) {
		throw new Error('a subclass of Behaviour must implements method "update"');
	};

    /**
     * @abstract
     */
    // p.lateUpdate = function() {}

	wozllajs.Behaviour = Behaviour;
	
})();