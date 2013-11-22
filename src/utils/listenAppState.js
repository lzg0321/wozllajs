define(function() {

	return function(stateCallbacks) {

		var onchange = function(e) {
			if(e.type === 'blur') stateCallbacks.onPause();
			else if(e.type === 'focus') stateCallbacks.onResume();
		};

		if(navigator.isCocoonJS) {

		}
		else if('onblur' in window) {
			window.onfocus = onchange;
			window.onblur = onchange;
		}


	}
});