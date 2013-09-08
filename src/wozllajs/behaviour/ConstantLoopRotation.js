wozllajs.defineComponent('behaviour.ConstantLoopRotation', {

    extend : 'Behaviour',

    silent : true,

    alias : 'behaviour.ConstantLoopRotation',

    speed : 1,

    update : function() {
        var trans = this.gameObject.transform;
        trans.rotation += (this.speed * wozllajs.Time.delta || 0);
        if(trans.rotation > 99999999) {
            trans.rotation = 0;
        }
    }

});