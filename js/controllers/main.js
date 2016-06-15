'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', '$log', '$http', 'journalmaster', 'editables', 'pimportws', 'settings', 
	function ($scope, $log, $http, journalmaster, editables, pimportws, settings) {
		
		/* debug */
		
		$scope.cacheKiller = '?nd=' + Date.now();
					
		/* initialize */
		
		$scope.isInitialized = false;
		
		$scope.init = function() {
			$scope.isInitialized = true;
		}
		
		/* tabs */
		
		$scope.tabs = [
			{"template": "partials/home.html",		"title": "Start"},
			{"template": "partials/error.html",		"title": "Analyze PDF"},
			{"template": "partials/articles.html",	"title": "Edit Articles"},
			{"template": "partials/xml.html",		"title": "Publish"}
		];
	
		$scope.currentTab = 0;
		
		$scope.changeTab = function(to) {
			$scope.server = {};
			$scope.currentTab = to;
		}
		
		$scope.nextTab = function() {
			$scope.server = {};
			$log.log('Next Tab', $scope.currentTab);
			$scope.currentTab += 1;
		}
		
		
		/* security */
		
		$scope.sec = {
			password: '',
			response: ''
		}
		
		$scope.checkPw = function() {
			pimportws.sec = $scope.sec;
			pimportws.get('checkStart', {'file': $scope.journal.importFilePath},  function(response) {				
				if (response.success) {
					$scope.sec.response  = '';
					$scope.start();
				} else {
					$scope.sec.password = '';
					$scope.sec.response  = response.message;
				}		
			});
		}
		
		
		/* journal specific */
		
		var master = {};
		
		$scope.journals = {
			types : {
				"chiron": "Chiron, whole Volume",
				"testdata": "Create some testdata",
			},
			chosen: 'chiron'
		};
		
		$scope.start = function() {
			
			// get journal specific service
			$log.log('load journal service ' +  $scope.journals.chosen );
			master = journalmaster.set($scope.journals.chosen);
			master.nextTab = $scope.nextTab;
			master.forwardArticle = $scope.addArticle;
			master.journal = $scope.journal;
			
			// right template
			$scope.tabs[1].template = master.template;
			
			// load next page
			$scope.nextTab();
			
			$log.log('starting');
		}
		

		
		/* journal */
		
		$scope.journal = {
			/*"title": 				editables.base('Chiron'),*/	
			"volume":				editables.base(''),
			"year":					editables.base(''),
			"importFilePath": 		"Chiron_2000.pdf",
			"identification":		"vol_year",
			"ojs_journal_code":		"ojs_journal_code",
			"ojs_user":				"ojs_user",
			"journal_code":			"importer journal code"
		};
		//"authors": editables.authorlist([{"firstname": "Panse Heter", "lastname": "Urang"}, {"firstname": "Jabber", "lastname": "Wocky"}])

		
		$scope.journalCheck = function() {
			var invalid = 0;
			angular.forEach($scope.journal, function(property) {
				if (angular.isObject(property) && (property.check() !== false)) {
					invalid += 1;
				}
			})
			return (invalid == 0);
		}
		
		/* articles */ 
		
		$scope.articles = [];
		$scope.articlesConfirmed = [];
		
		$scope.currentArticle = -1;
		
		function Article(title) {
			return {
				'title':			editables.base(title),
				'abstract':			editables.text('', false),
				'author':			editables.authorlist(),
				'pages':			editables.page(12),
				'date_published':	editables.base('DD-MM-YYYY'),
				'filepath':			'/path/to/parted/pdf',
				'thumbnail':		''
			}
		}
		
		$scope.addArticle = function(a) {
			if (angular.isUndefined(a)) {
				var a = new Article('Article ' +  $scope.articles.length);
			}
			$scope.articles.push(a);
			$log.log('Add Article ');
			$scope.selectArticle($scope.articles.length -1);
		}

		$scope.selectArticle = function(k) {
			$scope.currentArticle = k;
			$scope.resetZenon();
		}
		
		$scope.dismissArticle = function() {
			$log.log('Delete Article ' + $scope.currentArticle);
			$scope.resetZenon();
			$scope.articles.splice($scope.currentArticle, 1);
			$scope.currentArticle = 0;
		}
		
		$scope.isArticleSelected = function() {
			return ($scope.currentArticle != -1) && ($scope.articles.length > 0)
		};
		
		$scope.checkArticle = function() {
			var article = $scope.articles[$scope.currentArticle];
			var invalid = 0;
			angular.forEach(article, function(property) {
				if (angular.isObject(property) && (property.check() !== false)) {
					invalid += 1;
				}
			})
			return (invalid == 0);

		}
		
		$scope.confirmArticle = function() {
			var article = $scope.articles[$scope.currentArticle];
			//$log.log(article);
			if (article) {
				// prepare for uploading
				delete article.thumbnail;
				article.pages.context = {offset: parseInt(article.pages.context.offset)}
				$scope.articlesConfirmed.push(article);				
			}
			$scope.resetZenon();
			$scope.articles.splice($scope.currentArticle, 1);
			$scope.currentArticle = 0;
		}
		
		
		/* zenon connection */
		
		$scope.zenon = {};
		
		$scope.zenonMapDoc = function(doc) {
			function join(ar) {
				if (typeof ar === 'undefined') {
					return '';
				}
				var r = [];
				for (i = 0; i < ar.length; i++) {
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
				'publishDate':	doc.publishDate ? doc.publishDate[0] : '',
				'format':		doc.format ? doc.format[0] : '',
				'journal':		doc.container_title || doc.hierarchy_parent_title
			};
			
		}
		
		$scope.resetZenon = function() {
			$scope.zenon = {
					results: [],
					found: '',
					start: 0,
					search: ''
				};
		}
		
		$scope.compareWithZenon = function(more) {
			
			if (!more) {
				$scope.resetZenon();
				var term = $scope.articles[$scope.currentArticle].title.value.value;
			} else {
				var term = $scope.zenon.search
			}
			
			$log.log('Compare with Zenon; search for ' + term);

			$http({
				method: 'JSONP',
				url: 'http://zenon.dainst.org:8080/solr/biblio/select',
				params: {
					'json.wrf': 'JSON_CALLBACK',
					q: 'title:' + term,
					wt:	'json',
					start: parseInt($scope.zenon.start)
				}
			})
			.success(function(data) {
				$log.log('success');
				//$log.log(data);
				$scope.zenon.results = $scope.zenon.results.concat(data.response.docs.map($scope.zenonMapDoc));
				$scope.zenon.found = parseInt(data.response.numFound);
				$scope.zenon.start = parseInt(data.responseHeader.params.start) + 10;
				$scope.zenon.search = term;
			})
			.error(function(err) {
				$log.error(err);
			});
			
		};
		
		
		$scope.adoptFromZenon = function(index) {
			
			var doc = $scope.zenon.results[index];
			
			//$log.log(doc);
			
			var authors = [];
			
			if (doc.author) {
				authors.push(doc.author);
			}
			
			if (doc.author2 && angular.isArray(doc.author2)) {
				authors = authors.concat(doc.author2);
			}
			
			var set = {
				'title':			editables.base(doc.title),
				'abstract':			editables.text('', false),
				'author':			editables.authorlist(authors, 1),
				'pages':			editables.page(doc.pages),
				'date_published':	editables.base(doc.publishDate),
				'thumbnail':		$scope.articles[$scope.currentArticle].thumbnail,
				'filepath':			$scope.articles[$scope.currentArticle].filepath
			}
			
			//$log.log(set);
			
			$scope.articles[$scope.currentArticle] = set;
			
			$scope.resetZenon();
		};
		
		
		$scope.sendToZenon = function() {

			$scope.server = {};
			
			$scope.articles[$scope.currentArticle].thumbnail = '';
			
			pimportws.get('sendToZenon', {journal: $scope.journal, article: $scope.articles[$scope.currentArticle]}, function(response) {
				$scope.server = response;
			});

		}
		
		/* upload to ojs  */
		
		$scope.server = {}
		$scope.done = false;
		
		$scope.renderXml = function() {
			$scope.server = {};
			pimportws.get('makeXML', {journal: $scope.journal, articles: $scope.articlesConfirmed}, function(response) {
				$scope.server = response;
			});

		}
		
		$scope.uploadToOjs = function() {
			$scope.server = {};
			$scope.isInitialized = false;
			pimportws.get('toOJS', {journal: $scope.journal, articles: $scope.articlesConfirmed}, function(response) {
				$scope.isInitialized = true;
				$scope.server = response;
				if (response.success) {
					$scope.done = true;
				}
			});

		}
		/*
		$scope.cutPdf = function() {
			$scope.server = {};
			pimportws.get('cutPdf', {journal: $scope.journal, articles: $scope.articlesConfirmed}, function(response) {
				$scope.server = response;
			});
		}
		 */
		
		$scope.isReady = function() {
			var articlesReady = ($scope.articlesConfirmed.length > 0) && ($scope.articles.length == 0);
			var journalReady = $scope.journalCheck();
			return articlesReady && journalReady && !$scope.done;
		}
		
		
		
	}
])

;