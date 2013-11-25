var fs = require('fs');

var minCombines = ['build/define-min.js', 'dist/wozlla.js'];
var debugCombines = ['build/define.js', 'dist/wozlla-debug.js'];

var combine = function(list, dist) {
	if(fs.existsSync(dist)) {
		fs.unlinkSync(dist);
	}
	fs.openSync(dist, 'a+');
	list.forEach(function(path, i) {
		fs.appendFileSync(dist, fs.readFileSync(path));
	});
};

// combine
combine(minCombines, 'dist/wozlla-noncmd.js');
combine(debugCombines, 'dist/wozlla-noncmd-debug.js');
