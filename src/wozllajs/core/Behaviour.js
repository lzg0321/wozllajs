this.wozllajs = this.wozllajs || {};

(function() {
	"use strict";

	function Behaviour(params) {
		this.initialize(params);
	}

	var p = Behaviour.prototype = Object.create(wozllajs.Component.prototype);

	p.type = wozllajs.Component.BEHAVIOUR;

    /**
     * @abstract
     */
	// p.update = function(camera) {};

    /**
     * @abstract
     */
    // p.lateUpdate = function() {}

	wozllajs.Behaviour = Behaviour;
	
})();