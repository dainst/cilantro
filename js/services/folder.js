angular
.module('module.folder', [])
.factory('folder', ['$log', '$rootScope', 'settings', 'pimportws', function($log, $rootScope, settings, pimportws) {

	var folder = {};
	folder.dir = []; // filenames
	folder.files = []; // pdf.js documents
	folder.stats = {
		analyzed: 0,
		files: 0,
		loaded: 0,
		thumbnails: 0
	};
	folder.status = 'idle';
	folder.path = 'none';


	var requirePdfJs = new Promise(function(resolve) {
		require.config({paths: {'pdfjs': 'inc/pdf.js'}});
		require(['pdfjs/display/api', 'pdfjs/display/global'], function(pdfjs_api, pdfjs_global) {
			$log.log('2. required pdf.js');
			folder.status  = 'pdf.js loaded';

			folder.PDF = {
				"api": pdfjs_api,
				"global": pdfjs_global,
				"data": null,
				'object': null
			};

			folder.PDF.global.PDFJS.workerSrc = 'js/other/pdfjs_worker_loader.js';

			resolve();
		});
	});

	var loadFilePromises = [];

	var loadFiles = function() {

		for (var fileid in folder.dir) {

			var filename = folder.dir[fileid];
			var url = settings.rep_url + folder.path + '/' + filename;

			var promise = new Promise(
				function (resolve, fail) {
					folder.PDF.api.getDocument(url).then(resolve, fail)
				},
				function fail(reason) {
					$rootScope.$broadcast('message', {message: "get Document " + url + " failed: " + reason, 'success': false});
				}
			).then(
				function onGotDocument(pdf) {
					folder.files.push({
						pdf: pdf,
						filename: this.filename,
						url: this.url
					});

					folder.status = 'document nr' + folder.files.length + ' loaded';
					$rootScope.$broadcast('gotFile', (folder.files.length - 1));
				}.bind({filename: filename, url: folder.path + '/' + filename})
			);

			loadFilePromises.push(promise);
			//console.log('promises collected: ' + loadFilePromises.length);

		}

	}

	folder.getDocuments = function(path) {
		console.log("GO", path);
		folder.path =  path;

		var getFolder = new Promise(function(resolve) {
			console.log(folder.path);
			folder.status  = 'loading folder contents: ' + folder.path;
			pimportws.get('getRepositoryFolder', {dir: folder.path}, function(result) {
				$log.log('1. got folder:' + folder.path, result);
				if (!result.success) {
					$rootScope.$broadcast('message', {message:result.message, 'success': false});
				} else {
					folder.dir = result.dir;
					folder.stats.files = result.dir.length;
					folder.status  = 'folder contents loaded';
					resolve();
				}
			})

		});

		Promise.all([getFolder, requirePdfJs]).then(function() {
			folder.status  = 'all documents loaded';
			$rootScope.$broadcast('message', {message: 'ready for loading files'});
			loadFiles();
			Promise.all(loadFilePromises).then(function() {
				$rootScope.$broadcast('message', {message: "All Files loaded", "success": true});
				//$log.log($scope.files);
				$rootScope.$broadcast('gotAll');
			})
		});
	}



	return folder;
	

}]);
