define([
    './annotation/$Component'
], function($Component) {

    return function(id) {
        var construct;
        var all = $Component.allModule();
        var i, len, $componentAnno;
        for(i=0,len=all.length; i<len; i++) {
            $componentAnno = all[i];
            construct = $componentAnno.constructor;
            if($componentAnno.id === id) {
                return construct;
            }
            if(construct.prototype.alias === id) {
                return construct;
            }
        }
        console.log('[Warn] Unkow component "' + id + '", please import it first');
        return null;
    };
});