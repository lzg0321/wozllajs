this.wozllajs = this.wozllajs || {};

(function() {
    "use strict";

    var UIObject = function(id) {
        this.initialize(id);
    };

    var p = UIObject.prototype = Object.create(wozllajs.GameObject.prototype);



    wozllajs.UIObject = UIObject;

})();