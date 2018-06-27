/**
 * this will be the successor of journalmaster and stuff
 * it will have analyzer (protocol) (may be journal specific)
 * it will also have a datasource : folder or pdf


*/
angular

.module('controller.view_overview', [])

.controller('view_overview', ['$scope', 'settings', 'webservice', 'editables', 'messenger', 'dataset', 'documentsource', 'steps', 'labels',
	function($scope, settings, webservice, editables, messenger, dataset, documentsource, steps, labels) {

		messenger.content.stats = documentsource.stats;

        $scope.overviewColumns = {};


		/**
		 * initialization of overview view
		 * needs main controller to have set properly documentsource and protocol
		 */
		$scope.init = function() {

			console.log("Init View: Overview", $scope.protocol);

            Object.keys(new dataset.getModel().SubObjectPrototype()).map(function(key) {
                dataset.settings.overviewColumns[key] = {
                    'checked': false,
                    'title': labels.get("sub", key, true),
                    'description': labels.get("sub", key),
                    'label': labels.get("sub", key),
                    'style': labels.getStyle("sub", key),
                }
            });

			// adjust view
			angular.forEach($scope.protocol.columns, function(col) {
				dataset.settings.overviewColumns[col].checked = true;
			})

		};


		/* tools & buttons */


		$scope.addArticle = function() {
			let a = new dataset.Article('Article ' +  dataset.articles.length);
			dataset.articles.push(a);
			dataset.articleStats.update();

		}

		$scope.continue = function() {
			dataset.cleanArticles();
			steps.change('articles');
		}

		// open file externally
		$scope.openDocument = function(article) {
			console.log("OPEN " + article.filepath);
			window.open(settings.files_url + article.filepath.value.value);
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
				messenger.alert('Select another article to put it at the end of »' + article.title.get() + '«',1);
				$scope.selectedToMerge = article;
			} else {
				let article2 = article;
				article = $scope.selectedToMerge;
				if (confirm('Really attach article »' + article2.title.get() + '« to the end of »' + article.title.get() + "« ?")) {
					mergeArticles(article, article2);
				} else {
				    console.log("cancelled merging");
                    $scope.selectedToMerge = false;
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
			//dataset.deleteArticle(article)
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

			dataset.articles = orderArticles(dataset.articles, order, asc);
		}


		$scope.getFileInfo = documentsource.getFileInfo;

	}
]);
