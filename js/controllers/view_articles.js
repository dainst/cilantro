/**
 * Created by pfranck on 20.04.17.
 */
angular

.module('controller.view_articles', [])

.controller('view_articles', ['$scope', '$log', '$http', 'settings', 'pimportws', 'editables', 'messenger',
	function($scope, $log, $http, settings, pimportws, editables, messenger) {

		$scope.currentArticle = -1;

		$scope.init = function() {
			//messenger.ok();
			messenger.content.stats = $scope.articleStats.data;
			$scope.articleStats.update();
			console.log($scope.articleStats.data);
			$scope.selectArticle(0);
		}

		$scope.continue = function() {
			$scope.steps.change('publish');
		}

		$scope.addArticle = function(b, select) {
			var a = new $scope.Article('Article ' +  $scope.articles.length);

			if (!angular.isUndefined(b)) {
				angular.extend(a, b);
			}
			$scope.articles.push(a);
			if (select) {
				$scope.selectArticle($scope.articles.length -1);
			}

			$scope.articleStats.update();

		}

		$scope.selectArticle = function(k) {
			$scope.currentArticle = k;
			$scope.compareWithZenon();
		}

		$scope.selectNextArticle = function() {
			for (var i = $scope.currentArticle; i < $scope.articles.length; i++) {
				if (typeof $scope.articles[i]._.confirmed === "undefined") {
					return $scope.selectArticle(i)
				}
			}
			for (var i = 0; i < $scope.currentArticle; i++) {
				if (typeof $scope.articles[i]._.confirmed === "undefined") {
					return $scope.selectArticle(i)
				}
			}
			$scope.currentArticle = -1;
		}

		$scope.isArticleSelected = function() {
			return ($scope.currentArticle != -1) && ($scope.articles.length > 0)
		};

		$scope.checkArticle = function() {
			var article = $scope.articles[$scope.currentArticle];
			var invalid = 0;
			angular.forEach(article, function(property) {
				if ((typeof property !== "undefined") && (typeof property.check === "function") && (property.check() !== false)) {
					invalid += 1;
				}
			})
			return (invalid == 0);
		}

		$scope.confirmArticle = function() {
			var article = $scope.articles[$scope.currentArticle];


			if (article) {

				article._.confirmed = true;
				// prepare for uploading
				/*delete article.thumbnail;
				 article.pages.context = {offset: parseInt(article.pages.context.offset)}
				 $scope.articlesConfirmed.push(article);
				 */

				//$scope.articles.splice($scope.currentArticle, 1);
			}
			$scope.selectNextArticle();
			$scope.articleStats.update();

		}

		$scope.dismissArticle = function() {
			$log.log('Delete Article ' + $scope.currentArticle);
			$scope.resetZenon();
			//$scope.articles.splice($scope.currentArticle, 1); // @ TODO make dissmiss redoable
			$scope.articles[$scope.currentArticle]._.confirmed = false;

			$scope.selectNextArticle();
			$scope.articleStats.update();
		}



		/* zenon connection */

		$scope.zenon = {};
		$scope.reportedToZenon = [];

		$scope.zenonMapDoc = function(doc) {
			function join(ar) {
				if (typeof ar === 'undefined') {
					return '';
				}
				var r = [];
				for (var i = 0; i < ar.length; i++) {
					if (typeof ar[i] !== 'undefined') {
						r = r.concat(ar[i]);
					}
				};
				return r.join('; ');
			}

			return {
				'author': 		doc.author,
				'author2': 		doc.author2 ? doc.author2 : '',
				'title':		doc.title,
				'pages':		doc.physical ? doc.physical[0] : '',
				'date':			doc.publishDate ? doc.publishDate[0] : '',
				'format':		doc.format ? doc.format[0] : '',
				'journal':		doc.container_title || doc.hierarchy_parent_title,
				'id':			doc.id
			};

		}

		$scope.resetZenon = function() {
			$scope.zenon = {
				results: [],
				found: '',
				start: 0,
				search: '',
				selected: 0
			};
		}

		$scope.compareWithZenon = function(more) {

			if (($scope.currentArticle == -1) || (typeof $scope.articles[$scope.currentArticle] === 'undefined')) {
				return;
			}

			if (!more) {
				$scope.resetZenon();
				var term = $scope.articles[$scope.currentArticle].title.value.value;
			} else {
				var term = $scope.zenon.search
			}

			$log.log('Compare with Zenon; search for ' + term);

			$scope.articles[$scope.currentArticle].zenonId.value.value = '';

			$scope.zenon.selected = -1;

			$http({
				method: 'JSONP',
				url: 'https://zenon.dainst.org/data/biblio/select',
				params: {
					'json.wrf': 'JSON_CALLBACK',
					q: 'title:' + term.replace(':', ''),
					wt:	'json',
					start: parseInt($scope.zenon.start)
				}
			})
				.success(function(data) {
					$log.log('success');
					$log.log(data);
					$scope.zenon.results = $scope.zenon.results.concat(data.response.docs.map($scope.zenonMapDoc));
					$scope.zenon.found = parseInt(data.response.numFound);
					$scope.zenon.start = parseInt(data.responseHeader.params.start) + 10;
					$scope.zenon.search = term;
					if ($scope.zenon.found == 1) {
						$scope.selectFromZenon(0);
					}
				})
				.error(function(err) {
					console.error(err);
					$scope.$broadcast('alert', 'Could not connect to Zenon!', true);
				});

		};

		$scope.selectFromZenon = function(index) {
			$log.log('select = ' + index, $scope.zenon.results[index]);
			$scope.zenon.selected = ($scope.zenon.selected == index) ? -1 : index;
			$scope.articles[$scope.currentArticle].zenonId.value.value = ($scope.zenon.selected == -1) ? '' : $scope.zenon.results[index].id;

		}

		$scope.adoptFromZenon = function(index) {

			index = index || $scope.zenon.selected;

			var doc = $scope.zenon.results[index];

			//$log.log(doc);

			var authors = [];

			if (doc.author) {
				authors.push(doc.author);
			}

			if (doc.author2 && angular.isArray(doc.author2)) {
				authors = authors.concat(doc.author2);
			}

			var article = $scope.articles[$scope.currentArticle];

			article.title.value.value = doc.title;
			// article.abstract.value.value = abstract; // @ TODO adopt abstract from zenon?
			article.author.setAuthors(authors, 1);
			article.pages = editables.page(doc.pages);
			article.date_published = editables.base(doc.date);
			//article.language = editables.language('de_DE', false); // @ TODO adopt language from zenon?


			$scope.resetZenon();
		};

		$scope.markAsMissingZenon = function() {
			$scope.articles[$scope.currentArticle].zenonId.value.value = '(((new)))';
			//$scope.sendToZenon();
		}


		$scope.reportMissingToZenon = function() {
			angular.forEach($scope.articlesConfirmed, function(article) {
				if (article.zenonId.value.value == '(((new)))') {
					pimportws.get('sendToZenon', {journal: $scope.journal, article: article}, function (response) {
						$scope.reportedToZenon.push(article);
						$log.log(response);
					});
				}
			});
		}

		$scope.sendToZenon = function() {
			$scope.server = {};
			$scope.articles[$scope.currentArticle].thumbnail = '';
			pimportws.get('sendToZenon', {journal: $scope.journal, article: $scope.articles[$scope.currentArticle]}, function(response) {
				$scope.server = response;
			});
		}

		$scope.getReportUrl = function() {
			return window.settings.log_url;
		}

		$scope.openFullFile = function(url) {
			window.open(url);
		}

	}
]);
