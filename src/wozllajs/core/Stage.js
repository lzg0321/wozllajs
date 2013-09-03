this.wozllajs = this.wozllajs || {};

(function() {
	"use strict";

	var visibleRect = {
		x : 0,
		y : 0,
		width : 0,
		height : 0
	};

	function Stage(stageId, canvasIdOrElt, width, height) {
		this.initialize(stageId, canvasIdOrElt, width, height);
	}

	var p = Stage.prototype = Object.create(wozllajs.GameObject.prototype);

	p.isStage = true;

	p.stageCanvas = null;

	p.stageContext = null;

	p.width = 0;

	p.height = 0;

	p.autoClear = true;

	p.GameObject_initialize = p.initialize;

	p.initialize = function(stageId, canvasIdOrElt, width, height) {
		this.GameObject_initialize(stageId);
		this.stageCanvas = typeof canvasIdOrElt === 'string' ? 
			document.getElementById(canvasIdOrElt) : canvasIdOrElt;
		this.stageContext = this.stageCanvas.getContext('2d');
		this.width = width || 0;
		this.height = height || 0;
		this.stageCanvas.width = this.width;
		this.stageCanvas.height=  this.height;
	};

	p.GameObject_draw = p.draw;

	p.draw = function() {
		this.autoClear && this.stageContext.clearRect(0, 0, this.width, this.height);
		visibleRect.x = -this.transform.x;
		visibleRect.y = -this.transform.y;
		visibleRect.width = this.width;
		visibleRect.height = this.height;
		this.GameObject_draw(this.stageContext, visibleRect);
	};

    p.resize = function(width, height) {
        this.stageCanvas.width = width;
        this.stageCanvas.height = height;
        this.width = width;
        this.height = height;
    };

    p.getVisibleRect = function() {
        visibleRect.x = -this.transform.x;
        visibleRect.y = -this.transform.y;
        visibleRect.width = this.width;
        visibleRect.height = this.height;
        return visibleRect;
    };

	wozllajs.Stage = Stage;
	
})();