define(function() {

    return function(construct) {
        if(typeof construct === 'function') {
            return construct._super;
        }
        return null;
    }
});