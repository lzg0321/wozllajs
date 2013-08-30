this.wozllajs = this.wozllajs || {};

(function() {

    wozllajs.StageBuilder = (function() {

        return {

            buildStage : function(stageData, stage) {
                var children = stageData.children;
                for(var i= 0,len=children.length; i<len; i++) {
                    stage.addObject(this.buildGameObject(children[i]));
                }
                stage.backgroundColor = stageData.backgroundColor;
                return stage;
            },

            buildGameObject : function(objData) {
                var i, len;
                var gameObject = new wozllajs.GameObject(objData.gid);
                var components = objData.components;
                for(i= 0,len=components.length; i<len; i++) {
                    var component = this.buildComponent(components[i]);
                    if(component.type === wozllajs.Component.RENDERER) {
                        gameObject.setRenderer(component);
                    }
                    else if(component.type === wozllajs.Component.COLLIDER) {
                        gameObject.setCollider(component);
                    }
                    else if(component.type === wozllajs.Component.BEHAVIOUR) {
                        gameObject.addBehaviour(component);
                    }
                }
                var children = objData.children;
                for(i= 0,len=children.length; i<len; i++) {
                    gameObject.addObject(this.buildGameObject(children[i]));
                }
                var trans = objData.transform;
                gameObject.transform.x = trans.x;
                gameObject.transform.y = trans.y;
                gameObject.transform.regX = trans.regX;
                gameObject.transform.regY = trans.regY;
                gameObject.transform.skewX = trans.skewX;
                gameObject.transform.skewY = trans.skewY;
                gameObject.transform.scaleX = trans.scaleX;
                gameObject.transform.scaleY = trans.scaleY;
                gameObject.transform.rotation = trans.rotation;
                gameObject.transform.alpha = trans.alpha;
                return gameObject;
            },

            buildComponent : function(cmpData) {
                var cid = cmpData.cid;
                var properties = cmpData.properties;
                return wozllajs.createComponent(cid, properties);
            }
        };

    })();

})();