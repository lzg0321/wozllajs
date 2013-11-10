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
                break;
            }
            if(construct.prototype.alias === id) {
                break;
            }
        }
        return construct;
    };
});