'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', '$log', '$http', '$injector', 'editables', 'pimportws', 'settings',
	function ($scope, $log, $http, $injector, editables, pimportws, settings) {
		
		/* debug */
		$scope.cacheKiller = '?nd=' + Date.now();

		$scope.test = [
			{"title": "gulp", "checked": 0},
			{"title": "gulp2", "checked": 0},
			{"title": "gulp3", "checked": 0},
			{"title": "gulp4", "checked": 1},
			{"title": "gul5", "checked": 0},
		]

		/* step control */
		$scope.steps = {
			list: {
				"home": 	{"template": "partials/home.html",		"title": "Start"},
				"overview": {"template": "partials/overview.html",	"title": "Documents overview"},
				"articles": {"template": "partials/articles.html",	"title": "Edit Articles"},
				"publish": 	{"template": "partials/xml.html",		"title": "Publish"}
			},
			current:"home",
			change: function(to) {
				$log.log('Tab change to: ' + $scope.steps.list[to].title);
				//$scope.message.reset();
				$scope.steps.current = to;
			}
		}

		/* protocols */
		$scope.protocols = {
			list: { // @ TODO automatic somehow
				"chiron_parted": 	"Chiron, already parted into files",
				"chiron": 			"Chiron, whole Volume in one file",
				"testdata": 		"Create some testdata",
				"generic": 			"Generic"
			},
			current: "generic"
		}
		$scope.protocol = {
			id: "none"
		}

		/* current document source */
		$scope.documentSource = {
			name: "none",
			stats: {}
		}


		/* initialize */
		$scope.isInitialized = false;

		$scope.init = function() {
			pimportws.get('getRepository', {}, function(r) {
				if ((r.success == false) && (r.message == "Session locked")) {
					$scope.sessionLocked = true;
					$scope.sec.response = r.message;
				} else if (r.success == false) {
					$scope.sec.response = r.message;
				} else {
					$scope.repository.update(r.repository);
				}

				$scope.isInitialized = true;
			})
		}

		/* document repository */
		$scope.repository = {
			list: [],
			update: function (repository, selected) {
				$scope.repository.list = pimportws.repository = repository;
				if (typeof selected !== "undefined") {
					$scope.journal.importFilePath = selected;
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
				angular.forEach($scope.journal, function (property) {
					if (angular.isObject(property) && (property.check() !== false)) {
						invalid += 1;
					}
				})
				return (invalid == 0);
			}
		}


		/* message system */
		$scope.message = {
			content: {},
			reset: function() {
				$scope.message.content = {
					text: '',
					success: true,
					warnings: [],
					debug: [],
				}
			},
			show: function(msg, isError) {
				$scope.content.text = msg;
				$scope.content.success = !isError;
			}
		}

		$scope.$on('message', function($event, content) {
			$scope.message.content = content;
		})

		/* security */
		$scope.sec = pimportws.sec;

		/* ctrl */
		$scope.start = function() {
			//checkPW
			pimportws.get('checkStart', {'file': $scope.journal.data.importFilePath, 'unlock': true, 'journal': $scope.journal}, function(response) {
				if (response.success) {
					$scope.getProtocol($scope);
					$scope.getDocumentSource();
					$scope.protocol.init();
					// load next page
					$scope.steps.change('overview');
					// debug
					$log.log('starting');
					$log.log($scope.journal);
				} else {
					$scope.sec.password = '';
				}
			});
		}

		// get journal specific service
		$scope.getProtocol = function() {
			$log.log('load journal service ' +  $scope.protocols.current);
			$scope.protocol = $injector.get($scope.protocols.current);
			$scope.protocol.main = $scope;
		};

		$scope.getDocumentSource = function(type) {
			// @ TODO single files...
			$scope.documentSource = $injector.get('folder');
		}

		/* prototype contructur functions */
		$scope.Article =  function() {
			return {
				'title':			editables.base(''),
				'abstract':			editables.text('', false),
				'author':			editables.authorlist(),
				'pages':			editables.page(12),
				'date_published':	editables.base('DD-MM-YYYY'),
				'language':			editables.language('de_DE', false),
				'auto_publish':		editables.checkbox($scope.journal.default_publish_articles === true),
				'filepath':			$scope.journal.importFilePath,
				'thumbnail':		'',
				'attached':			editables.filelist(),
				'order':			editables.number(),
				'createFrontpage':	editables.checkbox($scope.journal.create_frontpage === true),
				'zenonId':			editables.base('', false)
			}
		}

		
	}
]);