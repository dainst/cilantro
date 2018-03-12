/**
 * this will be the successor of journalmaster and stuff
 * it will have analyzer (protocol) (may be journal specific)
 * it will also have a datasource : folder or pdf


*/
angular

.module('controller.view_overview', [])

.controller('view_overview', ['$scope', 'settings', 'webservice', 'editables', 'messenger', 'journal', 'documentsource',
	function($scope, settings, webservice, editables, messenger, journal, documentsource) {

		messenger.content.stats = documentsource.stats;

		const colStyles = {
			order: 			{minWidth: '50px', maxWidth: '80px'},
			author:			{minWidth: '400px'},
			title:			{minWidth: '400px'},
			pages:			{minWidth: '170px'},
			abstract:		{minWidth: '400px'},
			date_published:	{minWidth: '150px'},
			auto_publish:  	{minWidth: '10px'},
			filepath:		{minWidth: '150px'},
			attached:		{minWidth: '400px'},
			createFrontpage:{minWidth: '10px'},
			zenonId:		{minWidth: '150px'},
		}


		$scope.getStyle = function(columnName) {
			return (typeof colStyles[columnName] !== "undefined") ? colStyles[columnName] : {minWidth: '400px'};
		}


		/**
		 * initialization of overview view
		 * needs main controller to have set properly documentsource and protocol
		 */
		$scope.init = function() {

			console.log("Init View: Overview", $scope.protocol);

			// adjust view
			angular.forEach($scope.protocol.columns, function(col) {
				journal.settings.overviewColumns[col].checked = true;
			})

		}

		/* tools & buttons */


		$scope.addArticle = function() {
			var a = new journal.Article('Article ' +  journal.articles.length);
			journal.articles.push(a);
			journal.articleStats.update();

		}


		$scope.continue = function() {
			journal.cleanArticles();
			$scope.steps.change('articles');
		}

		// open file externally
		$scope.openDocument = function(article) {
			console.log("OPEN " + article.filepath);
			window.open(settings.rep_url + '/' + article.filepath.value.value);
		}


		/* merging articles */
		$scope.selectedToMerge = false;

		$scope.mergeArticle = function(article) {

			if ($scope.selectedToMerge && ($scope.selectedToMerge._.id === article._.id)) {
				messenger.ok();
				$scope.selectedToMerge = false;
				return;
			}

			if (!$scope.selectedToMerge)  {
				messenger.alert('Select article to attach »' + article.title.getLabel() + '« to',1);
				$scope.selectedToMerge = article;
			} else {
				var article2 = article;
				article = $scope.selectedToMerge;
				if (confirm('Really attach article »' + article2.title.getLabel() + '« to »' + article.title.getLabel() + "« ?!")) {
					mergeArticles(article, article2);
				} else {
					$scope.mergeArticle(false);
				}
			}

		}


		function mergeArticles(main, attach)  {

			console.log('merge!', main, attach);
			$scope.selectedToMerge = false;

			main.attached.push({
				file: attach.filepath.value.value,
				from: attach.pages.value.startPdf,
				to:   attach.pages.value.endPdf
			});// we could add from and to, but we use the whole file anyway!

			$scope.removeArticle(attach);

			messenger.alert('Articles Merged!');
			$scope.selectedToMerge = false;
		}



		/* delete */
		$scope.removeArticle = function(article) {
			//journal.deleteArticle(article)
			article._.confirmed = false;
		}


		/* thumbnail enlargement */
		$scope.selectedThumb = -1;
		$scope.selectThumb = function(i) {
			$scope.selectedThumb = (i === $scope.selectedThumb) ? -1 : i;
		}
		$scope.updateThumbnail = function(article) {
			documentsource.updateThumbnail(article);
		}

		/* order */
		$scope.updateOrder = function(order, asc, article) {

			if (!order || (order === '')) {
				return console.log('no order given');
			}

			asc = ((typeof asc !== "undefined") && asc) ? 1 : -1;

			function orderArticles(obj, order_by, asc) {

				obj.sort(function(a, b) {
					//console.log('ORDER BY ' + order_by + '(asc=' + asc + ')');
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

			if (order === 'up') {
				console.log ('up');
				article.order.value.value -= 15;
				order = 'order';
				asc = 1;
			}

			if (order === 'down') {
				console.log ('down');
				article.order.value.value += 15;
				order = 'order';
				asc = 1;
			}

			//console.log('order by ' + order + ' | ' + asc);

			journal.articles = orderArticles(journal.articles, order, asc);
		}


		$scope.getFileInfo = documentsource.getFileInfo;

	}
]);
