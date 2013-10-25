define(function() {

    var uniqueKeyIncrementor = 1;

    return function() {
        return uniqueKeyIncrementor++;
    };
});