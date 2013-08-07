WozllaJS.define('Time', function() {

    return {

        current : 0,
        last : 0,
        delta : 0,

        update : function() {
            this.current = Date.now();
            this.delta = this.current - this.last;
            this.last = this.current;
        },

        reset : function() {
            this.current = this.last = Date.now();
            this.delta = 0;
        }
    }

});