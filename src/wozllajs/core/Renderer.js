this.wozllajs = this.wozllajs || {};

(function() {
	"use strict";

	function Renderer(params) {
		this.initialize(params);
	}

	var p = Renderer.prototype = Object.create(wozllajs.Component.prototype);

	p.type = wozllajs.Component.RENDERER;

	p.draw = function(context, visibleRect) {
		throw new Error('a subclass of Renderer must implements method "draw"');
	};

	wozllajs.Renderer = Renderer;
	
})();