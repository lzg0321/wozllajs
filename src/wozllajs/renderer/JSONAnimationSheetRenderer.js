wozllajs.defineComponent('renderer.JSONAnimationSheetRenderer', {

    extend : 'renderer.AnimationSheetRenderer',

    alias : 'renderer.jsonAnimationSheet',

    ans : null,

    frameTime : null,

    initComponent : function() {
        this.AnimationSheetRenderer_initComponent();
        if(this.ans) {
            var ansData = this.getResourceById(this.ans);
            if(ansData) {
                this._applyData(ansData);
            }
        }
    },

    _applyData : function(ansData) {
        this.frames = ansData.frames;
        this.animations = ansData.animations;
        this.frameTime = this.frameTime || ansData.frameTime;
        this.defaultAnimation = this.defaultAnimation || ansData.defaultAnimation;
    },

    _collectResources : function(collection) {
        if(this.ans) {
            collection.push({
                id : this.ans,
                src : this.ans,
                type : 'json'
            });
            if(!this.src) {
                this.src = this.ans + '.png';
            }
        }
        if(this.src) {
            collection.push(this.src);
        }
    }

});