define(function() {

    return {

        delta : 0,

        now : 0,

		measuredFPS : 0,

        update : function() {
            var now = Date.now();
            if(this.now) {
                this.delta = now - this.now;
				this.measuredFPS = 1000/this.delta;
            }
            this.now = now;
        },

        reset : function() {
            this.delta = 0;
            this.now = 0;
        }
    };
});