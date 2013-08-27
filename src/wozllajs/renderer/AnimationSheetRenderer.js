wozllajs.defineComponent('renderer.AnimationSheetRenderer', function() {

    var Time = wozllajs.Time;

	var AnimationSheetRenderer = function(params) {
		this.initialize(params);
	};

	var p = AnimationSheetRenderer.prototype = Object.create(wozllajs.Renderer.prototype);

    p.alias = 'renderer.animationSheet';

    p.image = null;

    p._playingFrameSequence = null;

    p._currentIndex = 0;

    p._currentFrame = null;

    p._currentFrameStartTime = null;

    p.src = null;

    p.frameTime = 33;

    p.frames = null;

    p.animations = null;

    p.defaultAnimation = null;

    p.initComponent = function() {
        if(this.src) {
            this.image = this.getResourceById(this.src);
        }
    };

    p.update = function() {
        if(!this.frames) {
            return;
        }

        if(!this._currentFrameStartTime) {
            this._currentFrameStartTime = Time.now;
        }

        if(!this._playingFrameSequence) {
            this._playingFrameSequence = this.animations[this.defaultAnimation];
        }

        if(Time.now - this._currentFrameStartTime >= this.frameTime) {
            this._currentFrameStartTime = Time.now;
            this._currentIndex ++;
            if(this._currentIndex >= this._playingFrameSequence.length) {
                this._currentIndex = 0;
                this._playingFrameSequence = this.animations[this.defaultAnimation];
            }
            this._currentFrame = this.frames[this._playingFrameSequence[this._currentIndex]];
        }
    };

    p.draw = function(context) {
        var frame = this._currentFrame, w, h, ox, oy;
        if(this.image && frame) {
            w = frame.width || frame.w;
            h = frame.height || frame.h;
            ox = frame.offsetX || frame.ox || 0;
            oy = frame.offsetY || frame.oy || 0;
            context.drawImage(this.image, frame.x, frame.y, w, h, ox, oy, w, h);
        }
    };

    p.play = function(animations, defaultAnimation) {
        var sequence = [];
        var i, len;
        if(!wozllajs.isArray(animations)) {
            animations = [animations];
        }
        for(i=0,len=animations.length; i<len; i++) {
            sequence = sequence.concat(this.animations[animations[i]]);
        }
        this._playingFrameSequence = sequence;
        this._currentIndex = 0;
        if(defaultAnimation) {
            this.defaultAnimation = defaultAnimation;
        }
    };

    p._collectResources = function(collection) {
        if(this.src) {
            collection.push(this.src);
        }
    };

    return AnimationSheetRenderer;

});