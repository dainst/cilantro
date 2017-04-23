'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', '$log', '$injector', 'editables', 'webservice', 'settings', 'messenger', 'protocolregistry',
	function ($scope, $log, $injector, editables, webservice, settings, messenger, protocolregistry) {

		
		/* debug */
		$scope.cacheKiller = '?nd=' + Date.now();

		/* step control */
		$scope.steps = {
			list: {
				"home": 	{"template": "partials/view_home.html",			"title": "Start"},
				"overview": {"template": "partials/view_overview.html",		"title": "Documents overview"},
				"articles": {"template": "partials/view_articles.html",		"title": "Edit Articles"},
				"publish": 	{"template": "partials/view_finish.html",		"title": "Publish"}
			},
			current:"home",
			change: function(to) {
				$log.log('Tab change to: ', to);
				console.log('from m', $scope.articles);
				//$scope.message.reset();
				$scope.steps.current = to;
			}
		}

		/* protocols */
		$scope.protocols = {
			list: protocolregistry.protocols,
			current: "generic"
		}
		$scope.protocol = {
			id: "none"
		}

		/* current document source */
		$scope.documentSource = {
			name: "none"
		}

		/* initialize */
		$scope.isInitialized = false;

		$scope.init = function() {
			webservice.get('getRepository', {}, function(r) {
				if ((r.success == false) && (r.message == "Session locked")) {
					$scope.sessionLocked = true;
				} else if (r.success == true) {
					$scope.repository.update(r.repository);
				}
				$scope.isInitialized = true;
			})
		}


		/* document repository */
		$scope.repository = {
			list: [],
			update: function (repository, selected) {
				$scope.repository.list = webservice.repository = repository;
				if (typeof selected !== "undefined") {
					$scope.journal.data.importFilePath = selected;
				}
			}
		}

		/* journal */
		$scope.journal = {
			data: {
				/*"title": 				editables.base('Chiron'),*/
				"volume": editables.base(''),
				"year": editables.base(''),
				"importFilePath": settings.devMode ? "checkdas.pdfdir" : '',
				"identification": "vol_year",
				"ojs_journal_code": "ojs_journal_code",
				"ojs_user": "ojs_user",
				"journal_code": "importer journal code",
				"auto_publish_issue": editables.checkbox(false),
				"default_publish_articles": true,
				"default_create_frontpage": true
			},
			showOnHomepage: ['volume', 'year'],
			check: function () {
				var invalid = 0;
				angular.forEach($scope.journal.data, function (property) {
					if (angular.isObject(property) && (property.check() !== false)) {
						invalid += 1;
					}
				})
				return (invalid == 0);
			}
		}

		/* articles */
		$scope.articles = [];

		$scope.articleStats = {
			data: {
				articles: $scope.articles.length,
				undecided: 0,
				confirmed: 0,
				dismissed: 0,
				_isOk: function(k, v) {
					if (k == 'undecided') {
						return 0;
					} else if (k == 'confirmed') {
						return 1;
					} else if (k == 'dismissed') {
						return -1;
					}
				}
			},
			update: function() {
				$scope.articleStats.data.articles = $scope.articles.length;
				$scope.articleStats.data.undecided = 0;
				$scope.articleStats.data.confirmed = 0;
				$scope.articleStats.data.dismissed = 0;

				for (var i = 0; i < $scope.articles.length; i++) {
					if (typeof $scope.articles[i]._.confirmed === "undefined") {
						$scope.articleStats.data.undecided += 1;
					} else if ($scope.articles[i]._.confirmed === true) {
						$scope.articleStats.data.confirmed += 1;
					} else if ($scope.articles[i]._.confirmed === false) {
						$scope.articleStats.data.dismissed += 1;
					}
				}
			}

		}


		/* security */
		$scope.sec = webservice.sec;

		/* ctrl */
		$scope.start = function() {
			//checkPW
			webservice.get('checkStart', {'file': $scope.journal.data.importFilePath, 'unlock': true, 'journal': $scope.journal}, function(response) {
				if (response.success) {
					$scope.getProtocol();
					$scope.getDocumentSource();
					$scope.protocol.init();
				} else {
					$scope.sec.password = '';
				}
			});
		}

		// get journal specific service
		$scope.getProtocol = function() {
			$log.log('load journal service ' +  $scope.protocols.current);
			$scope.protocol = $scope.protocols.list[$scope.protocols.current];
			$scope.protocol.main = $scope;
		};

		$scope.getDocumentSource = function(type) {
			// @ TODO single files... (and remove $injector dependency)
			$scope.documentSource = $injector.get('folder');
		}

		/* prototype contructur functions */
		$scope.Article =  function(data) {
			data = data || {};
			return {
				'title':			editables.base(data.title),
				'abstract':			editables.text(data.abstract, false),
				'author':			editables.authorlist(data.author),
				'pages':			editables.page(data.pages),
				'date_published':	editables.base(data.date_published || 'DD-MM-YYYY'),
				'language':			editables.language('de_DE', false),
				'auto_publish':		editables.checkbox($scope.journal.data.default_publish_articles === true),
				'filepath':			$scope.journal.data.importFilePath,
				'thumbnail':		'',
				'attached':			editables.filelist(),
				'order':			editables.number(0, false),
				'createFrontpage':	editables.checkbox($scope.journal.data.create_frontpage === true),
				'zenonId':			editables.base('', false),
				'_':				{}
			}
		}

		
	}
]);