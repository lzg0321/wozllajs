wozllajs.defineComponent('renderer.AnimationSheetRenderer', {

    extend : 'Renderer',

    alias : 'renderer.animationSheet',

    image : null,

    _eventDispatcher : null,

    _playingFrameSequence : null,

    _currentIndex : null,

    _currentAnimation : null,

    _currentFrame : null,

    _currentFrameStartTime : null,

    src : null,

    frameTime : 33,

    frames : null,

    animations : null,

    defaultAnimation : null,
    _defaultAnimation : null,

    initComponent : function() {
        this._defaultAnimation = this.defaultAnimation;
        this._eventDispatcher = new wozllajs.EventDispatcher();
        if(this.src) {
            this.image = this.getResourceById(this.src);
        }
    },

    update : function() {
        var fireIndex, fireFrame, fireEnd;
        var index = this._currentIndex, frameNum, frame;
        var animation = this._currentAnimation;
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
        if(!this._playingFrameSequence) {
            this._currentIndex = null;
            this._currentFrame = null;
            this._currentFrameStartTime = null;
            return;
        }

        if(Time.now - this._currentFrameStartTime >= this.frameTime) {
            this._currentFrameStartTime = Time.now;
            index = this._currentIndex + 1;
            if(index >= this._playingFrameSequence.length) {
                index = 0;
                this._eventDispatcher.fireEvent('animationend', {
                    animation : animation
                });
                this._playingFrameSequence = this.animations[this.defaultAnimation];
                this._currentAnimation = this.defaultAnimation;
                if(!this._playingFrameSequence) {
                    this._currentIndex = null;
                    this._currentFrame = null;
                    this._currentFrameStartTime = null;
                    return;
                }
            }
        }

        if(!index) {
            index = 0;
        }
        if(index !== this._currentIndex) {
            fireIndex = true;
            this._currentIndex = index;
            frameNum = this._playingFrameSequence[index];
            frame = this.frames[frameNum];
            if(frame !== this._currentFrame) {
                fireFrame = true;
                this._currentFrame = frame;
            }
        }

        if(fireIndex) {
            this._eventDispatcher.fireEvent('indexchanged', {
                index : index,
                animation : this._currentAnimation
            });
        }

        if(fireFrame) {
            this._eventDispatcher.fireEvent('framechanged', {
                frameNum : frameNum,
                frame : frame,
                animation : this._currentAnimation
            });
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

    pause : function() {

    },

    stop : function() {
        this.defaultAnimation = null;
        this._playingFrameSequence = null;
        this._currentAnimation = null;
        this._currentFrameStartTime = null;
        this._currentFrame = null;
        this._currentIndex = null;
    },

    play : function(animation, defaultAnimation) {
        if(!animation) {
            animation = this.defaultAnimation = this._defaultAnimation;
        }
        this._playingFrameSequence = this.animations[animation];
        this._currentIndex = null;
        this._currentFrameStartTime = null;
        this._currentAnimation = animation;
        if(this._playingFrameSequence) {
            this._currentFrame = this.frames[this._playingFrameSequence[this._currentIndex]];
        }
        if(defaultAnimation) {
            this.defaultAnimation = defaultAnimation;
        }
    },

    addEventListener : function() {
        this._eventDispatcher.addEventListener.apply(this._eventDispatcher, arguments);
    },

    removeEventListener : function() {
        this._eventDispatcher.removeEventListener.apply(this._eventDispatcher, arguments);
    },

    _collectResources : function(collection) {
        if(this.src) {
            collection.push(this.src);
        }
    }

});