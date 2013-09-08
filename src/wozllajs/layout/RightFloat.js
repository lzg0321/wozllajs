wozllajs.defineComponent('layout.RightFloat', function($) {

    var RightFloat = function(params) {
        this.initialize(params);
    };

    var p = RightFloat.prototype = Object.create(wozllajs.Layout.prototype);

    p.id = 'layout.RightFloat';

    p.alias = 'layout.rightFloat';

    p.doLayout = function() {
        this.gameObject.transform.x += this.gameObject.getStage().width;
    };

    return RightFloat;

});