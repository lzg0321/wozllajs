this.wozllajs = this.wozllajs || {};

(function() {

	var Array2D = function() {
		this.data = {};
	};

	Array2D.prototype = {
        push : function(key, val) {
            this.data[key] = this.data[key] || [];
            this.data[key].push(val);
        },
        get : function(key) {
            if(key === undefined) {
                return this.data;
            }
            return this.data[key] || [];
        },
        sort : function(key, sorter) {
            this.data[key].sort(sorter);
            return this;
        },
        remove : function(key, val) {
            var idx, i, len;
            var array = this.data[key];
            if(!array) {
                return false;
            }
            for(i=0,len=array.length; i<len; i++) {
                if(array[i] === val) {
                    idx = i;
                    break;
                }
            }
            if(idx !== undefined) {
                array.splice(idx, 1);
                return true;
            }
            return false;
        },
        clear : function(key) {
            if(key) {
                this.data[key] = undefined;
            } else {
                this.data = {};
            }
        }
    };

    wozllajs.Array2D = Array2D;

})();