define(function() {

    return {
        toString : function(query) {
            if(!query) {
                return '';
            }
            var i, str = '';
            for(i in query) {
                str += '&' + i + '=' + query[i];
            }
            if(str) {
                str = str.substr(1);
            }
            return str;
        },
        toQuery : function(str) {
            // TODO
        }
    }
});