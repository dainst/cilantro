/**
 * Created by pfranck on 20.04.17.
 */
angular

.module('controller.view_articles', [])

.controller('view_articles', ['$scope', '$http', '$sce', 'settings', 'webservice', 'editables', 'messenger', 'dataset', 'steps',
	function($scope, $http, $sce, settings, webservice, editables, messenger, dataset, steps) {

		const zenonEndpoint = $sce.trustAsResourceUrl('https://zenon.dainst.org/data/biblio/select');

		console.log(dataset.get())

		$scope.currentArticle = -1;

		$scope.init = function() {
			messenger.ok();
			messenger.content.stats = dataset.articleStats.data;
			dataset.articleStats.update();
			$scope.selectArticle(0);
		}

		$scope.continue = function() {
			steps.change('publish');
		}

		$scope.addArticle = function(b, select) {
			let a = new dataset.Article('Article ' +  dataset.articles.length);

			if (!angular.isUndefined(b)) {
				angular.extend(a, b);
			}
			dataset.articles.push(a);
			if (select) {
				$scope.selectArticle(dataset.articles.length -1);
			}

			dataset.articleStats.update();

		}

		$scope.selectArticle = function(k) {
			$scope.currentArticle = k;
			if (dataset.articles[$scope.currentArticle]._.autoFetchFromZenon && dataset.articles[$scope.currentArticle].zenonId.value.value !== '') {
				$scope.autoFetchFromZenon()
			} else if (!dataset.articles[$scope.currentArticle]._.reportToZenon) {
				$scope.compareWithZenon();
			}


		}

		$scope.selectNextArticle = function() {
			for (let i = $scope.currentArticle; i < dataset.articles.length; i++) {
				if (typeof dataset.articles[i]._.confirmed === "undefined") {
					return $scope.selectArticle(i)
				}
			}
			for (let i = 0; i < $scope.currentArticle; i++) {
				if (typeof dataset.articles[i]._.confirmed === "undefined") {
					return $scope.selectArticle(i)
				}
			}
			$scope.currentArticle = -1;
		}

		$scope.isArticleSelected = function() {
			return ($scope.currentArticle !== -1) && (dataset.articles.length > 0)
		};

		$scope.checkArticle = function() {
			let article = dataset.articles[$scope.currentArticle];
			let invalid = 0;
			angular.forEach(article, function(property, id) {
				if ((typeof property !== "undefined") && (typeof property.check === "function") && (property.check() !== false)) {
					invalid += 1;
				}
			});
			return (invalid === 0);
		}

		$scope.confirmArticle = function() {
			let article = dataset.articles[$scope.currentArticle];

			if (article) {

				article._.confirmed = true;
				// prepare for uploading
				/*delete article.thumbnail;
				 article.pages.context = {offset: parseInt(article.pages.context.offset)}
				 dataset.articlesConfirmed.push(article);
				 */

				//dataset.articles.splice($scope.currentArticle, 1);
			}
			dataset.articleStats.update();

			if (dataset.articleStats.data.undecided === 0){
				$scope.continue();
			} else {
				$scope.selectNextArticle();
			}

		}

		$scope.dismissArticle = function() {
			console.log('Delete Article ' + $scope.currentArticle);
			$scope.resetZenon();

			dataset.articles[$scope.currentArticle]._.confirmed = false;

			dataset.articleStats.update();

			if (dataset.articleStats.data.undecided === 0){
				$scope.continue();
			} else {
				$scope.selectNextArticle();
			}
		}



		/* zenon connection */

		$scope.zenon = {};


		$scope.zenonMapDoc = function(doc) {
			function join(ar) {
				if (typeof ar === 'undefined') {
					return '';
				}
				let r = [];
				for (let i = 0; i < ar.length; i++) {
					if (typeof ar[i] !== 'undefined') {
						r = r.concat(ar[i]);
					}
				}
				return r.join('; ');
			}

			return {
				'author': 		doc.author,
				'author2': 		doc.author2 ? doc.author2 : '',
				'title':		doc.title,
				'pages':		doc.physical ? doc.physical[0] : '',
				'date':			doc.publishDate ? doc.publishDate[0] : '',
				'format':		doc.format ? doc.format[0] : '',
				'dataset':		doc.container_title || doc.hierarchy_parent_title,
				'id':			doc.id
			};

		}

		$scope.resetZenon = function() {
			$scope.zenon = {
				results: [],
				found: '',
				start: 0,
				search: '',
				selected: 0,
				searchId: false
			};
		}

		$scope.compareWithZenon = function(more) {

            dataset.articles[$scope.currentArticle]._.reportToZenon = false;

			if (($scope.currentArticle === -1) || (typeof dataset.articles[$scope.currentArticle] === 'undefined')) {
				return;
			}

			let term;
			if (!more) {
				$scope.resetZenon();
				term = dataset.articles[$scope.currentArticle].title.value.value;
			} else {
				term = $scope.zenon.search
			}

			if (!term || term === "") {
				return;
			}

			console.log('Compare with Zenon; search for ' + term);

			dataset.articles[$scope.currentArticle].zenonId.value.value = '';

			$scope.zenon.selected = -1;

			$http({
				method: 'JSONP',
				url: zenonEndpoint,
				params: {
					q: 'title:' + term.replace(':', ''),
					wt:	'json',
					start: parseInt($scope.zenon.start)
				},
                jsonpCallbackParam: 'json.wrf'
			})
				.then(
					function(data) {
						console.log('success');
						console.log(data);
						data = data.data;
						$scope.zenon.results = $scope.zenon.results.concat(data.response.docs.map($scope.zenonMapDoc));
						$scope.zenon.found = parseInt(data.response.numFound);
						$scope.zenon.start = parseInt(data.responseHeader.params.start) + 10;
						$scope.zenon.search = term;
						if ($scope.zenon.found === 1) {
							$scope.selectFromZenon(0);
						}
					},
					function(err) {
						console.error(err);
						messenger.alert('Could not connect to Zenon!', true);
					}
				);

		};


		$scope.autoFetchFromZenon = function() {
			$scope.resetZenon();
			$http({
					method: 'JSONP',
					url: zenonEndpoint,
					params: {
						q: 'id:' + dataset.articles[$scope.currentArticle].zenonId.value.value,
						wt:	'json'
					},
					jsonpCallbackParam: 'json.wrf'
			})
				.then(
					function(data) {
						console.log('success');
						console.log(data);
                        data = data.data;
						$scope.zenon.results = $scope.zenon.results.concat(data.response.docs.map($scope.zenonMapDoc));
						$scope.zenon.found = Number(data.response.numFound);
						$scope.zenon.start = Number(data.responseHeader.params.start) + 10;
						$scope.zenon.search = dataset.articles[$scope.currentArticle].zenonId.value.value;
						$scope.zenon.searchId = true;
						if ($scope.zenon.found === 1) {
							$scope.adoptFromZenon(0);
							messenger.alert('Data fetched from zenon');
						}
						dataset.articles[$scope.currentArticle]._.autoFetchFromZenon = false;

					},
					function(err) {
						console.error(err);
						messenger.alert('Could not connect to Zenon!', true);
						dataset.articles[$scope.currentArticle]._.autoFetchFromZenon = false;
					}
				);
		}

		$scope.selectFromZenon = function(index) {
			console.log('select = ' + index, $scope.zenon.results[index]);
			$scope.zenon.selected = ($scope.zenon.selected === index) ? -1 : index;
			dataset.articles[$scope.currentArticle].zenonId.value.value = ($scope.zenon.selected === -1) ? '' : $scope.zenon.results[index].id;

		}

		$scope.adoptFromZenon = function(index) {

			index = index || $scope.zenon.selected;

			let doc = $scope.zenon.results[index];

			//console.log(doc);

			let authors = [];

			if (doc.author) {
				authors.push(doc.author);
			}

			if (doc.author2 && angular.isArray(doc.author2)) {
				authors = authors.concat(doc.author2);
			}

			let article = dataset.articles[$scope.currentArticle];

			article.title.set(doc.title);
			// article.abstract.value.value = abstract; // @ TODO adopt abstract from zenon?
			article.author.setAuthors(authors, 1);
			article.pages.set(doc.pages.replace('.', ''));
			article.date_published.set(doc.date);
			//article.language = editables.language('de_DE', false); // @ TODO adopt language from zenon?


			//$scope.resetZenon();
		};

		$scope.markAsMissingZenon = function() {
			dataset.articles[$scope.currentArticle].zenonId.value.value = '(((new)))';
			dataset.articles[$scope.currentArticle]._.reportToZenon = true;
			//$scope.sendToZenon();
		}



		$scope.openFullFile = function(url) {
			window.open(url);
		}

	}
]);
