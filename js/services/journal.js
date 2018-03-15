angular
.module("module.journal", [])
.factory("journal", ['editables', '$rootScope', 'settings', function(editables, $rootScope, settings) {

	/* base contruction */

	let journal = {
		data: {},			// metadata for the imported issue
		articles: [],			// collection of articles to import
		thumbnails: {},			// their thumbnails
		articleStats: {			// statistics about the articles
			data: {}
		},
		settings: {},			// UI settings for displaying this journal
		loadedFiles: {},		// information about loaded files
		locales: [], 			// available locales
	} // will be filled by journal.reset()

	/**
	 *  meta information
	 *
	 *  this is a set of information, wich can be set when we select the backend and get the info from there
	 *  it should never be modified by protocol.
	 *
	 */
	var journalConstraints = {} 	// information about available journals and their contraints
	var journalCodes = {};			// list of journals. must be a separate thing, otherwise time problem
	journal.getConstraint = function(journalCode, constraint) {
		if ((typeof journalConstraints[journalCode] !== "undefined") && (typeof journalConstraints[journalCode][constraint] !== "undefined")) {
			return journalConstraints[journalCode][constraint];
		}
	}
	journal.setConstraints = function(constraints) {
		journalConstraints = constraints;
		Object.keys(constraints).map(function(item){journalCodes[item] = item});
		console.log(journalCodes)
	}




	/* constants */

	// compare with https://github.com/pkp/ojs/blob/ojs-stable-2_4_8/plugins/importexport/native/NativeExportDom.inc.php#L32
	const ojs_identifications_codes = {
		'num_vol_year_title':'num_vol_year_title',
		'num_vol_year':'num_vol_year',
		'vol_year':'vol_year',
		'num_year_title':'num_year_title',
		'year':'year',
		'vol':'vol',
		'title':'title'
	}


	/**
	 *
	 * labels
	 *
	 * some may consider the following as a not good mixture between content, view and controller.
	 * but I prefer this, because if you want to add anything to the Article model, you only do it one single file
	 *
	 */
	journal.descriptions = {
		"volume": 			"Volume",
		"number": 			"Number",
		"year": 			"Year",
		"description":		"Description (e.g. '[PDFs teilweise verfügbar]')",
		"ojs_journal_code": "OJS: Journal Code (e.g. 'chiron', 'aa', 'efb')",
		"ojs_user": 		"OJS: user",
		"identification": 	"OJS: issue identification",

		"importFilePath": 	"File(s) to import",

		"auto_publish_issue": 		"Publish Issue after upload",
		"default_publish_articles": "Publish Articles by default",
		"default_create_frontpage": "Create Frontpage by default"
	}


	journal.articleDescriptions = {
		order: {
			title: '#',
			description: 'Order',
		},
		author: {
			title: 'Author',
		},
		title: {
			title: 'Title',
		},
		pages: {
			title: 'Pages',
		},
		abstract: {
			title: 'Abstract',
		},
		date_published: {
			title: 'Date',
		},
		auto_publish: {
			description: 'Automatically publish?',
			title: '#',
		},
		filepath: {
			title: 'Loaded File',
		},
		attached: {
			title: 'Attached',
			description: 'Attached Files/Pages',
		},
		createFrontpage: {
			description: 'Automatically Create Frontpage?',
			title: '#',
		},
		zenonId: {
			title: 'ZenonId',
		},
		language: {
			title: 'language'
		}
	}



	/* default data */
	journal.reset = function() {
		console.log('reset journal');

		let journalCodeChangedObserver = function() {
			/**
			 * this gets triggered when a journal is chosen, since we hopefully know wich locales this journal supports,
			 * we replace locales with the journal specific.
			 * it has to be done like the following, not just replace the array, since we would have a new instance
			 * and the integrity of the editables using locales would break!
			 * @type {number}
			 */
			journal.locales.length = 0;
			journal.getConstraint(journal.data.ojs_journal_code.get(), 'locales').map(function(loc) {
				journal.locales.push(loc);
			});

		}

		/* the journal metadata */
		journal.data = {
			"volume": 					editables.base(''),
			"year": 					editables.base(''),
			"number": 					editables.base(''),
			"description": 				editables.base('[PDFs teilweise verfügbar]', false),
			"importFilePath": 			"",
			"identification": 			editables.listitem(ojs_identifications_codes, 'vol_year', false),
			"ojs_journal_code": 		editables.listitem(journalCodes, false, false).watch(journalCodeChangedObserver),
			"ojs_user": 				"ojs_user",
			"auto_publish_issue": 		editables.checkbox(false),
			"default_publish_articles":	true,
			"default_create_frontpage": true
		}

		/* list of defined articles */
		journal.articles = [];

		/* list of loade files for the file selector editable */
		journal.loadedFiles = {};

		journal.thumbnails = {};
		/* they are not part of the article obj since they are very large and iterating over the
		 articles array in the digest give performance issues otherwise! */

		journal.locales = ['de_DE', 'en_US', 'fr_FR', 'it_IT', 'es_ES'];
		/* locales list is part of journal, since some journals might be limited to some locale or
		might have extra ones */

		/* statistical data */
		journal.articleStats.data = {
			articles: 0,
			undecided: 0,
			confirmed: 0,
			dismissed: 0
		}
		journal.articleStats.data._isOk = function(k, v) {
			if (k === 'undecided') {
				return 0;
			} else if (k === 'confirmed') {
				return 1;
			} else if (k === 'dismissed') {
				return -1;
			}
		}

		/* settings (states of the views), editable by protocol */

		/* editable fields in homepage */
		journal.settings.hideOnHomepage = ['importFilePath'];

		/* switched on columns in the overview */
		journal.settings.overviewColumns = {}

		/* apply */
		Object.keys(new journal.Article).map(function(key) {
			journal.settings.overviewColumns[key] = {
				'checked': false,
				'title': (typeof journal.articleDescriptions[key] !== "undefined") ?
					(journal.articleDescriptions[key].description || journal.articleDescriptions[key].title)
					: key
			}
		})
	}




	/* validate */
	journal.check = function () {
		let invalid = 0;
		angular.forEach(journal.data, function (property) {
			if (angular.isObject(property) && (property.check() !== false)) {
				invalid += 1;
			}
		});
		return (invalid === 0);
	}


	/* stats */
	journal.articleStats.update = function() {
		journal.articleStats.data.articles = journal.articles.length;
		journal.articleStats.data.undecided = 0;
		journal.articleStats.data.confirmed = 0;
		journal.articleStats.data.dismissed = 0;

		for (let i = 0; i < journal.articles.length; i++) {
			if (typeof journal.articles[i]._.confirmed === "undefined") {
				journal.articleStats.data.undecided += 1;
			} else if (journal.articles[i]._.confirmed === true) {
				journal.articleStats.data.confirmed += 1;
			} else if (journal.articles[i]._.confirmed === false) {
				journal.articleStats.data.dismissed += 1;
			}
		}
	}


	journal.isReadyToUpload = function() {
		return (journal.articleStats.data.undecided === 0) && (journal.articleStats.data.articles > 0)
	}






	/**
	 * get journal data in uploadable form
	 * @param article  - optional - select only one article
	 * @returns {{data: *, articles: Array}}
	 */
	journal.get = function(article) {

		function flatten(obj) {
			let newObj = {}
			angular.forEach(obj, function(value, key) {
				newObj[key] = angular.isFunction(value.get) ? value.get() : value;
			});
			return newObj;
		}

		return {
			data: flatten(journal.data),
			articles: Object.keys(journal.articles)
				.filter(function(i) {return journal.articles[i]._.confirmed === true})
				.filter(function (i) {return (typeof this._ !== "undefined") ? (this._.id === journal.articles[i]._.id) : true}.bind(article))
				.map(function(i) {return flatten(journal.articles[i])})
		}

	}



	/* article functions */
	journal.cleanArticles = function() {
		angular.forEach(journal.articles, function(article, k) {
			if (typeof article._ !== "undefined") {
				article._ = {};
			}
		});
	}

	journal.deleteArticle = function(article) {
		// the price for using an array for articles...
		for (let i = 0; i < journal.articles.length; i++) {
			if (article === journal.articles[i]) {
				break;
			}
		}
		journal.undoDeleteArticle = journal.articles[i];
		journal.articles.splice(i, 1);
	}



	/* Article constructor function */
	journal.Article =  function(data) {
		data = data || {};
		function guid() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
		}

		let articlePrototype = {
			'title':			editables.base(data.title, true),
			'abstract':			editables.text(data.abstract, false),
			'author':			editables.authorlist(data.author),
			'pages':			editables.page(data.pages),
			'date_published':	editables.base(data.date_published || 'DD-MM-YYYY'),
			'language':			editables.language('de_DE', false, journal.locales),
			'auto_publish':		editables.checkbox(journal.data.default_publish_articles === true),
			'filepath':			editables.loadedfile(journal.loadedFiles),
			'attached':			editables.filelist(),
			'order':			editables.number(0, false),
			'createFrontpage':	editables.checkbox(journal.data.create_frontpage === true),
			'zenonId':			editables.base(data.zenonId, false)
		}
		Object.defineProperty(articlePrototype, '_', {enumerable: false, configurable: false, value: {}});

		articlePrototype._.id = guid();

		function thumbnailDataObserver() {
			$rootScope.$broadcast('thumbnaildataChanged', articlePrototype)
		}

		articlePrototype.filepath.watch(thumbnailDataObserver);
		articlePrototype.pages.watch(thumbnailDataObserver);


		return (articlePrototype);
	}

	journal.reset();

	return (journal);
}]);
