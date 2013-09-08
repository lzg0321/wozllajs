wozllajs.defineComponent('renderer.AnimationSheetRenderer', {

    extend : 'Renderer',

    alias : 'renderer.animationSheet',

    image : null,

    _playingFrameSequence : null,

    _currentIndex : 0,

    _currentFrame : null,

    _currentFrameStartTime : null,

    src : null,

    frameTime : 33,

    frames : null,

    animations : null,

    defaultAnimation : null,

    initComponent : function() {
        if(this.src) {
            this.image = this.getResourceById(this.src);
        }
    },

    update : function() {
        var Time = wozllajs.Time;
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
    },

    draw : function(context) {
        var frame = this._currentFrame, w, h, ox, oy;
        if(this.image && frame) {
            w = frame.width || frame.w;
            h = frame.height || frame.h;
            ox = frame.offsetX || frame.ox || 0;
            oy = frame.offsetY || frame.oy || 0;
            context.drawImage(this.image, frame.x, frame.y, w, h, ox, oy, w, h);
        }
    },

    play : function(animations, defaultAnimation) {
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
    },

    _collectResources : function(collection) {
        if(this.src) {
            collection.push(this.src);
        }
    }

});