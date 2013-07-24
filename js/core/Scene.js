WozllaJS.define('Scene', function($) {

    function Scene() {
        this.root = null;
        this.camera = null;
        this.backgroundColor = "#000000";
    }

    Scene.prototype = {

        setRoot : function(gameObject) {
            this.root = gameObject;
        },

        setCamera : function(camera) {
            this.camera = camera;
        },

        mainLoop : function() {
            this.camera.context.fillStyle = this.backgroundColor;
            this.camera.context.fillRect(0, 0, this.camera.width, this.camera.height);
            this.camera.context.save();
            this.camera.applyTransform();

            if(this.root) {
                this.updateGameObject(this.root);
                this.lateUpdateGameObject(this.root);
                this.renderGameObject(this.root, this.camera.context);
            }

            this.camera.context.restore();
        },

        updateGameObject : function(gameObject) {
            var components = gameObject.components.update;
            var i, len=components.length;
            for(i=0; i<len; i++) {
                components[i].update();
            }
            var children = gameObject.children;
            len = children.length;
            for(i=0; i<len; i++) {
                this.updateGameObject(children[i]);
            }
        },

        lateUpdateGameObject : function(gameObject) {
            var components = gameObject.components.lateUpdate;
            var i, len=components.length;
            for(i=0; i<len; i++) {
                components[i].lateUpdate();
            }
            var children = gameObject.children;
            len = children.length;
            for(i=0; i<len; i++) {
                this.lateUpdateGameObject(children[i]);
            }
        },

        renderGameObject : function(gameObject, context) {
            var components = gameObject.components.render;
            var i, len=components.length;
            for(i=0; i<len; i++) {
                components[i].render(context);
            }
            var children = gameObject.children;
            len = children.length;
            for(i=0; i<len; i++) {
                this.renderGameObject(children[i], context);
            }
        }
    };

    return Scene;

});