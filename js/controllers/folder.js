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
	
	$scope.articles = master.rawArticles;
	
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
	
	/* proceed */
	
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
			//$log.log($scope.files);
			journalmaster.control.onGotAll();
		})
	});
	
	
	/* nice functions, may be used from frintend */
	
	// open file externally
	$scope.openDocument = function(url) {
		$log.log("OPEN " + url);
		window.open(settings.rep_url + '/' + url);
	}
	

	$scope.selectedToMerge = -1;
	
	$scope.mergeArticle = function(articleId) {
		var article = $scope.articles[articleId];
		$log.log(articleId);
		
		if ($scope.selectedToMerge == articleId) {
			master.status.message = '';
			master.status.error = '';
			$scope.selectedToMerge = -1;
			return;
		}
		
		
		if ($scope.selectedToMerge == -1)  {
			master.status.message  = 'Select article to attach »' + article.title.value.value + '« to';
			master.status.error  = 'warning';
			$scope.selectedToMerge = articleId;
		} else {
			var article2 = $scope.articles[$scope.selectedToMerge];
			if (confirm('Really attach article »' + article2.title.value.value + '« to »' + article.title.value.value + "«?!")) {
				mergeArticles(articleId, $scope.selectedToMerge);
			} else {
				$scope.mergeArticle(-1);
			}
		}
		
	}
	
	function mergeArticles(mainId, attachId)  {
		
		var main = $scope.articles[mainId];
		var attach = $scope.articles[attachId];
		
		//$log.log('merge!', main, attach);
		$scope.selectedToMerge -1;
		
		main.attached = (typeof main.attached === "undefined") ? [] : main.attached;
		attach.attached = (typeof attach.attached === "undefined") ? [] : attach.attached;
		
		
		angular.extend(main.attached, attach.attached);
		
		main.attached.push({
			file: attach.url
		});// we could add from and to, but we use the whole file anyway!
		
		delete $scope.articles[attachId];
		
		master.status.message = 'Articles Merged!';
		master.status.error = '';
		$scope.selectedToMerge = -1;
		
		
	}
	
	
	
}]);
