angular

.module('controller.folder', [])

.controller('folder', ['$scope', '$log', 'journalmaster', 'settings', 'pimportws', function($scope, $log, journalmaster, settings, pimportws) {
	

	var master = $scope.master = journalmaster.control;
	
	master.status = {
		error: false,
		message: 'starting',
	};
	
	master.isReady = false;
	
	var refresh = master.refresh = function() {
		//$log.log('refresh');
		$scope.$apply();
	}
	
	var message = master.message = function(txt, error) {
		//$log.log('MESSAGE', txt, error)
		$scope.master.status =  {
			error: error,
			message: txt
		}
		master.refresh();
		
	}
	
	var stats = master.stats = {
		files: 0,
		loaded: 0,
		analyzed: 0,
		thumbnails: 0
	}

	
	$scope.path = journalmaster.control.journal.importFilePath; 
	$scope.dir = []; // filenames
	$scope.files = journalmaster.control.files = []; // pdf.js documents
	
	$log.log('PATH', $scope.path);
	
	
	var getFolder = new Promise(function(resolve) {
		pimportws.get('getRepositoryFolder', {dir: $scope.path}, function(result) {
			$log.log('1. got folder:', result);
					
			if (!result.success) {
				message(result.message, 'error');
			} else {
				$scope.dir = result.dir;
				master.stats.files = result.dir.length;
				resolve();
			}
		})
		
	});
	
	var requirePdfJs = new Promise(function(resolve) {
		require.config({paths: {'pdfjs': 'inc/pdf.js'}});
		require(['pdfjs/display/api', 'pdfjs/display/global'], function(pdfjs_api, pdfjs_global) {
			$log.log('2. required pdf.js')
			
			$scope.PDF = {
				"api": pdfjs_api,
				"global": pdfjs_global,
				"data": null,
				'object': null,
			}
			
			$scope.PDF.global.PDFJS.workerSrc = 'js/other/pdfjs_worker_loader.js';
			
			resolve();
		});
	});
		
	var loadFilePromises = [];
	
	var loadFiles = function() {
		$scope.folder = {};
		
		for (fileid in $scope.dir) {

			var filename = $scope.dir[fileid];
			var url = settings.rep_url + $scope.path + '/' + filename;
			/*
			$scope.files[filename] = {
				state: 'pending',
				url: url,
				pdf: null
			};
			*/
			var promise = new Promise(
				function (resolve, fail) {
					$scope.PDF.api.getDocument(url).then(resolve, fail)
				},
				function fail(reason) {
					message("get Document " + url + " failed: " + reason, 'error');
				}
			).then(
				function onGotDocument(pdf) {		
					$scope.files.push({
						pdf: pdf,
						filename: this.filename,
						url: this.url
					});
					
					$scope.status = 'document nr' + $scope.files.length + ' loaded';
					journalmaster.control.onGotFile($scope.files.length - 1);
				}.bind({filename: filename, url: $scope.path + '/' + filename})
			);
			
			loadFilePromises.push(promise);
			//console.log('promises collected: ' + loadFilePromises.length);
				
		}
		
	}
	
	
	
	Promise.all([getFolder, requirePdfJs]).then(function() {
		message('ready for loading files');
		loadFiles();
		Promise.all(loadFilePromises).then(function() {
			message("All Files loaded");
			console.log($scope.files);
			journalmaster.control.onGotAll();
		})
	});
	
	
	
	
	
}]);
