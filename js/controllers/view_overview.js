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

		$scope.columns = {
			order: {
				title: '#',
				tooltip: 'order',
				style: {minWidth: '50px', minWidth: '80px'},
				checked: false
			},
			author: {
				title: 'Author',
				style: {minWidth: '400px'},
				checked: false
			},
			title: {
				title: 'Title',
				style: {minWidth: '400px'},
				checked: false
			},
			pages: {
				title: 'Pages',
				style: {minWidth: '200px'},
				checked: false
			},
			abstract: {
				title: 'Abstract',
				style: {minWidth: '400px'},
				checked: false
			},
			date_published: {
				title: 'Date',
				style: {minWidth: '150px'},
				checked: false
			},
			auto_publish:  {
				tooltip: 'auto publish?',
				title: '#',
				style: {minWidth: '10px'},
				checked: false
			},
			filepath: {
				title: 'filepath',
				style: {minWidth: '150px'},
				checked: false
			},
			attached: {
				title: 'attached',
				style: {minWidth: '400px'},
				checked: false
			},
			createFrontpage: {
				tooltip: 'create Frontpage?',
				title: '#',
				style: {minWidth: '10px'},
				checked: false
			},
			zenonId: {
				title: 'ZenonId',
				style: {minWidth: '150px'},
				checked: false
			}
		}



		/* proceed */

		/**
		 * initialization of overview view
		 * needs main controller to have set properly documentsource and protocol
		 */
		$scope.init = function() {

			console.log("Init View: Overview", $scope.protocol);

			// adjust view
			angular.forEach($scope.protocol.columns, function(col) {
				$scope.columns[col].checked = true;
			})

		}

		/* tools & buttons */
		$scope.continue = function() {
			journal.cleanArticles();
			$scope.steps.change('articles');
		}

		// open file externally
		$scope.openDocument = function(url) {
			console.log("OPEN " + url);
			window.open(settings.rep_url + '/' + url);
		}

		$scope.selectedToMerge = false;

		$scope.mergeArticle = function(article) {

			if ($scope.selectedToMerge && ($scope.selectedToMerge._.id == article._.id)) {
				messenger.ok();
				$scope.selectedToMerge = false;
				return;
			}

			if (!$scope.selectedToMerge)  {
				messenger.alert('Select article to attach »' + article.title.value.value + '« to',1);
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


		$scope.selectedThumb = -1;
		$scope.selectThumb = function(i) {
			$scope.selectedThumb = (i == $scope.selectedThumb) ? -1 : i;
		}
		$scope.updateThumbnail = function(article) {
			documentsource.updateThumbnail(article);
		}


		function mergeArticles(main, attach)  {

			console.log('merge!', main, attach);
			$scope.selectedToMerge = false;


			//angular.extend(main.attached.value.value, attach.attached.value.value);

			main.attached.push({
				file: attach.filepath
			});// we could add from and to, but we use the whole file anyway!

			$scope.removeArticle(attach);

			messenger.alert('Articles Merged!')
			$scope.selectedToMerge = false;
		}


		$scope.removeArticle = function(article) {
			article._.deleted = true;
			$scope.cleanArticles();
			$scope.updateOrder('order', false);
		}

		$scope.updateOrder = function(order, asc, article) {

			if (!order || (order == '')) {
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

			if (order == 'up') {
				console.log ('up');
				article.order.value.value -= 15;
				order = 'order';
				asc = 1;
			}

			if (order == 'down') {
				console.log ('down');
				article.order.value.value += 15;
				order = 'order';
				asc = 1;
			}

			//console.log('order by ' + order + ' | ' + asc);

			journal.articles = orderArticles(journal.articles, order, asc);
		}




	}
]);
