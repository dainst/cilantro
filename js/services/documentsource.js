angular
.module('module.documentsource', ['module.messenger', 'module.webservice'])
.factory('documentsource', ['$rootScope', 'settings', 'webservice', 'messenger', 'journal',
	function($rootScope, settings, webservice, messenger, journal) {

	var folder = {};

	folder.reset = function() {
		folder.dir = []; // filenames
		folder.files  = {}; // pdf.js documents / index: filenames
		folder.stats  = {
			files: 0,
			analyzed: 0,
			loaded:  0,
			thumbnails: 0,
			_isOk: function(k, v) {
				return v >= folder.stats.files ? 1 : -1;
			}
		}
		folder.path  = 'none';
		folder.ready = false
		console.log("FUCKSHIT");
	}

	folder.reset();

	var requirePdfJs = new Promise(function(resolve) {
		require.config({paths: {'pdfjs': 'inc/pdf.js'}});
		require(['pdfjs/display/api', 'pdfjs/display/global'], function(pdfjs_api, pdfjs_global) {
			console.log('2. required pdf.js');
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
					messenger.alert("get Document " + url + " failed: " + reason, true);
				}
			).then(
				function onGotDocument(pdf) {
					folder.files[this.url] = {
						pdf: pdf,
						filename: this.filename,
						url: this.url
					};
					messenger.alert('document nr' + Object.keys(folder.files).length + ' loaded');
					$rootScope.$broadcast('gotFile', this.url);
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
			messenger.alert('loading folder contents: ' + folder.path);
			webservice.get('getRepositoryFolder', {dir: folder.path}, function(result) {
				console.log('1. got folder:' + folder.path, result);
				if (!result.success) {
					// should message itself
				} else {
					folder.dir = result.dir;
					folder.stats.files = result.dir.length;
					messenger.alert('folder contents loaded');
					resolve();
				}
			})

		});

		Promise.all([getFolder, requirePdfJs]).then(function() {
			messenger.alert('ready for loading files');
			loadFiles();
			Promise.all(loadFilePromises).then(function() {
				messenger.alert("All Files loaded");
				refreshView()
				$rootScope.$broadcast('gotAll');
			})
		});
	}

		/**
		 * call this from a button or something ...
		 * @param article
		 */
	folder.updateThumbnail = function(article) {
		console.log("recreate thumbnail for", article, article.pages.getCutAt().start, article._.url);
		console.log(article._.url, folder);
		folder.files[article._.url].pdf.getPage(article.pages.getCutAt().start).then(function(page) {
			folder.createThumbnail(page, article._.id)
		});
	}

		/**
		 * ... or this from inside a getPage promise
		 * @param page
		 * @param containerId
		 */
	folder.createThumbnail = function(page, containerId) {
		var container = angular.element(document.querySelector('#thumbnail-container-' + containerId));
		var img = container.find('img');

		var viewport = page.getViewport(1.5); // scale 1.5
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.height = viewport.height; // 626.16 * 1.5
		canvas.width = viewport.width; // 399.84 * 1.5

		var renderContext = {
			canvasContext: ctx,
			viewport: viewport
		};

		container.addClass('loader');
		img.unbind('load');
		img.on("load", function() {
			container.removeClass('loader');
		});

		page.render(renderContext).then(function(){
			ctx.globalCompositeOperation = "destination-over";
			ctx.fillStyle = "#123456";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			journal.thumbnails[containerId] = canvas.toDataURL();
			folder.stats.thumbnails = Object.keys(journal.thumbnails).length;
			refreshView()
		});

	}

	/**
	 * since the pdf.kjs stuff is happening outside angular is is ansync we need this shit here
	 *
	 */
	function refreshView() {
		folder.ready =
			(folder.stats.files > 0)
			&& (folder.stats.analyzed >= folder.stats.files)
			&& (folder.stats.loaded >= folder.stats.files)
			&& (folder.stats.thumbnails >= folder.stats.files)
		$rootScope.$broadcast('refreshView');
	}

	return folder;
	

}]);
