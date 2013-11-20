define(function(require) {
    var wozllajs = require('wozllajs');
	var stage = new wozllajs.core.Stage({
		canvas : document.getElementById('canvas'),
		autoClear : true
	});
	wozllajs.core.Engine.start();
});