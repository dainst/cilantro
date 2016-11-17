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
	$scope.thumbnails = master.thumbnails;
	
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
	
	$scope.selectedToMerge = false;
	
	$scope.mergeArticle = function(article) {
		
		if ($scope.selectedToMerge._id == article._id) {
			master.status.message = '';
			master.status.error = '';
			$scope.selectedToMerge = false;
			return;
		}
		
		if (!$scope.selectedToMerge)  {
			master.status.message  = 'Select article to attach »' + article.title.value.value + '« to';
			master.status.error  = 'warning';
			$scope.selectedToMerge = article;
		} else {
			var article2 = article;
			article = $scope.selectedToMerge;
			if (confirm('Really attach article »' + article2.title.value.value + '« to »' + article.title.value.value + "« ?!")) {
				mergeArticles(article, article2);
			} else {
				$scope.mergeArticle(false);
			}
		}
		
	}
	
	function mergeArticles(main, attach)  {
		
		$log.log('merge!', main, attach);
		$scope.selectedToMerge = false;
		
		main.attached = (typeof main.attached === "undefined") ? [] : main.attached;
		attach.attached = (typeof attach.attached === "undefined") ? [] : attach.attached;
	
		angular.extend(main.attached, attach.attached);
		
		main.attached.push({
			file: attach.url
		});// we could add from and to, but we use the whole file anyway!
		
		$scope.removeArticle(attach);
		
		master.status.message = 'Articles Merged!';
		master.status.error = '';
		$scope.selectedToMerge = false;
	}
	
	$scope.cleanArticles = function() {
		$scope.articles = $scope.articles.filter(function(a) {
			return !a._deleted;
		})
		$log.log($scope.articles);
	}
	
	
	$scope.removeArticle = function(article) {
		article._deleted = true;
		$scope.cleanArticles();
		$scope.updateOrder('order', false);
	}
	
	$scope.updateOrder = function(order, asc, article) {
		
		if (!order || (order == '')) {
			return $log.log('no order given');
		}		
		
		asc = ((typeof asc !== "undefined") && asc) ? 1 : -1;

		function orderArticles(obj, order_by, asc) {

			obj.sort(function(a, b) {
				//$log.log('ORDER BY ' + order_by + '(asc=' + asc + ')');
				if (typeof a[order_by] === "object") {
					return asc * a[order_by].compare(b[order_by]);
				}
				
				return (asc * a[order_by].localeCompare(b[order_by]));
			});
			
			angular.forEach(obj, function(a, i) {
				a.order.value.value = (i + 1)  * 10;
			})
	
			return obj;
		}
		
		if (order == 'up') {
			$log.log ('up');
			article.order.value.value -= 15;
			order = 'order';
			asc = 1;
		}
		
		if (order == 'down') {
			$log.log ('down');
			article.order.value.value += 15;		
			order = 'order';
			asc = 1;
		}
		
		//$log.log('order by ' + order + ' | ' + asc);
		
		$scope.articles = orderArticles($scope.articles, order, asc);
	}
	
	
}]);
