var path = require('path');
var fs = require('fs');
var operandi = require('operandi');

function noop() {}

function get_folders_from_folder(folder) {
	return function(done) {
		fs.readdir(path.resolve(folder, 'node_modules'), done);
	}
}

function filterPrefix(prefix) {
	var filter = new RegExp('^' + prefix);

	function fn(folder) {
		return filter.test(folder);
	}

	return function(folders, done) {
		return done(undefined, folders.filter(fn));
	};
}

function getMetaData(folders, done) {
	operandi.eachBatch(folders, function(arr, index, done) {
		var folder = arr[index];
		var package_json = path.resolve('node_modules', folder, 'package.json');

		fs.readFile(package_json, function(err, data) {
			var package = {};

			if (! err) {
				package = JSON.parse(data);
				if (package.main) {
					// ensure that main has been resolved absolutely
					package.main = path.resolve('node_modules', folder, package.main);
				}
			}

			if (! package.main) {
				// alternatively try to locate an index.js file in the folder
				var index_js = path.resolve('node_modules', folder, 'index.js');
				fs.exists(index_js, function(exists) {
					if (exists){
						package.name = package.name || folder;
						package.main = index_js;

						return done(undefined, package);
					}

					return done(err, package);
				});
			}
			else {
				return done(err, package);
			}
		});
	}, 10, done);
}

function removePackagesWithNoMainFile(packages, done) {
	done(undefined, packages.filter(function(package) {
		return package && !!package.main;
	}));
}


module.exports = function(folder, prefix, done) {
	done = (typeof done === 'function' ? done : noop);

	return operandi.serial([
		get_folders_from_folder(folder),
		filterPrefix(prefix),
		getMetaData,
		removePackagesWithNoMainFile
	], done);
};
