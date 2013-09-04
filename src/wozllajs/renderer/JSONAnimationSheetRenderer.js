wozllajs.defineComponent('renderer.JSONAnimationSheetRenderer', function() {

    var Time = wozllajs.Time;

    var JSONAnimationSheetRenderer = function(params) {
        this.initialize(params);
    };

    var p = JSONAnimationSheetRenderer.prototype = Object.create(wozllajs.renderer.AnimationSheetRenderer.prototype);

    p.id = 'renderer.JSONAnimationSheetRenderer';

    p.alias = 'renderer.jsonAnimationSheet';

    p.ans = null;

    p.frameTime = null;

    p.initComponent = function() {
        if(this.src) {
            this.image = this.getResourceById(this.src);
        }
        if(this.ans) {
            var ansData = this.getResourceById(this.ans);
            if(ansData) {
                this._applyData(ansData);
            }
        }
    };

    p._applyData = function(ansData) {
        this.frames = ansData.frames;
        this.animations = ansData.animations;
        this.frameTime = this.frameTime || ansData.frameTime;
        this.defaultAnimation = this.defaultAnimation || ansData.defaultAnimation;
    };

    p._collectResources = function(collection) {
        if(this.ans) {
            console.log(this.ans);
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
    };

    return JSONAnimationSheetRenderer;

});