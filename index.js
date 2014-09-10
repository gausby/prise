var path = require('path');
var fs = require('fs');
var operandi = require('operandi');
var readPackageJson = require('read-package-json');

function noop() {}

function getFolders(basedir) {
	return function(done) {
		fs.readdir(path.resolve(basedir), done);
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

function getMetaData(basedir) {
	return function(folders, done) {
		operandi.eachBatch(folders, function(arr, index, done) {
			var folder = path.resolve(basedir, arr[index]);

			function readPackageData(done) {
				var package_json = path.resolve(folder, 'package.json');
				fs.exists(package_json, function(hasPackage) {
					if (hasPackage) {
						return readPackageJson(package_json, done);
					}
					// return a minimal package object if non-existent
					return done(undefined, { name: arr[index] });
				});
			}

			function resolveMainFile(package, done) {
				if (package.main) {
					// get absolute path to main file
					package.main = path.resolve(folder, package.main);
					return done(undefined, package);
				}

				// alternatively try to locate an index.js file in the folder
				var index_js = path.resolve(folder, 'index.js');
				fs.exists(index_js, function(exists) {
					if (exists){
						package.main = index_js;
					}

					return done(undefined, package);
				});
			}

			return operandi.serial([readPackageData, resolveMainFile], done);
		}, 10, done);
	}
}

function removePackagesWithNoMainFile(packages, done) {
	done(undefined, packages.filter(function(package) {
		return package && !!package.main;
	}));
}

module.exports = function(basedir, prefix, callback) {
	callback = (typeof callback === 'function' ? callback : noop);

	return operandi.serial([
		getFolders(basedir),
		filterPrefix(prefix),
		getMetaData(basedir),
		removePackagesWithNoMainFile
	], callback);
};
