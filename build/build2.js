({
    baseUrl: "./../source",
    name: "wozlla",
    out: "./../libs/wozllajs-v2-min.js",
    onBuildWrite : function(moduleName, path, contents) {
        if(moduleName === 'wozlla') {
            return contents.replace("'wozlla'", "'wozllajs'");
        }
        return contents;
    }
})