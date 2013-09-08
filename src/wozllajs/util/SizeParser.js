this.wozllajs = this.wozllajs || {};

this.wozllajs.SizeParser = (function() {

    return {
        parse : function(size, stage) {
            var result;
            if(parseInt(size) == size) {
                return parseInt(size);
            }
            if(typeof size === 'string') {
                result = /^(\d+(\.\d+)?)%$/.exec(size);
                if(!result) {
                    return null;
                }
                return parseInt(stage.width * parseFloat(result[1]) / 100);
            } else {
                return size;
            }
        }
    }

})();