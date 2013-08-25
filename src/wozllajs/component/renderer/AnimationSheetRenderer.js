wozllajs.defineComponent('wozlla.component.renderer.AnimationSheetRenderer', {

    alias : 'renderer.animationSheet',

    natures : [
        wozlla.Component.NATURE_RENDER,
        wozlla.Component.NATURE_BEHAVIOR
    ],

    extend : 'wozlla.Component',

    image : null,

    playingFrameSequence : null,

    currentIndex : 0,

    currentFrame : null,

    currentFrameStartTime : null,

    src : null,

    frameTime : 33,

    frames : null,

    animations : null,

    defaultAnimation : null,

    init : function() {
        if(this.src) {
            this.image = this.getResourceById(this.src);
        }
    },

    update : function(time, update) {
        if(!this.frames) {
            return;
        }
        
        if(!this.currentFrameStartTime) {
            this.currentFrameStartTime = time.now;
        }

        if(!this.playingFrameSequence) {
            this.playingFrameSequence = this.animations[this.defaultAnimation];
        }

        if(time.now - this.currentFrameStartTime >= this.frameTime) {
            this.currentFrameStartTime = time.now;
            this.currentIndex ++;
            if(this.currentIndex >= this.playingFrameSequence.length) {
                this.currentIndex = 0;
                this.playingFrameSequence = this.animations[this.defaultAnimation];
            }
            this.currentFrame = this.frames[this.playingFrameSequence[this.currentIndex]];
        }
    },

    draw : function(context) {
        var frame = this.currentFrame, w, h, ox, oy;
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
        this.playingFrameSequence = sequence;
        this.currentIndex = 0;
        if(defaultAnimation) {
            this.defaultAnimation = defaultAnimation;
        }
    },

    _getResources : function(res) {
        if(this.src) {
            res.push(this.src);
        }
    }



});