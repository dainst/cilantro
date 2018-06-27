angular
.module("module.dataset", [])
.factory("dataset", ['editables', '$rootScope', 'settings', 'journalIssue',
    function(editables, $rootScope, settings, journalIssue) {

	/**
	 * Refactor Plans
	 * - put UI.settings in different object maybe (it's here to get resetted with teh journal object in any case, but...)
	 * - make different models work
     * - rename things from Article to SubObject
	 */

    const model = journalIssue;

	/* base construction */

	let dataset = {
		data: {},				// metadata for the imported issue
		articles: [],			// collection of articles to import
		thumbnails: {},			// their thumbnails
		articleStats: {			// statistics about the articles
			data: {}
		},
        loadedFiles: {},        // files loaded into pdf.js
		settings: {},			// UI settings for displaying this journal

	}; // will be filled by journal.reset()

	/* default data */
	dataset.reset = function() {
		console.log('reset dataset');

		/* the journal metadata */
		dataset.data = new model.MainObjectPrototype();

		/* list of defined articles */
		dataset.articles = [];

		/* list of loaded files for the file selector editable */
		dataset.loadedFiles = {};

		dataset.thumbnails = {};
		/* they are not part of the article obj since they are very large and iterating over the
		 articles array in the digest give performance issues otherwise! */

		/* statistical data */
		dataset.articleStats.data = {
			articles: 0,
			undecided: 0,
			confirmed: 0,
			dismissed: 0
		};
		dataset.articleStats.data._isOk = function(k, v) {
			if (k === 'undecided') {
				return 0;
			} else if (k === 'confirmed') {
				return 1;
			} else if (k === 'dismissed') {
				return -1;
			}
		};

		/* settings (states of the views), editable by protocol */

		/* editable fields in homepage */
		dataset.settings.hideOnHomepage = ['importFilePath'];

		/* switched on columns in the overview */
		dataset.settings.overviewColumns = {};


	};

	/* validate */
	dataset.check = function () {
		let invalid = 0;
		angular.forEach(dataset.data, function(property) {
			if (angular.isObject(property) && (property.check() !== false)) {
				invalid += 1;
			}
		});
		return (invalid === 0);
	};

	/* stats */
	dataset.articleStats.update = function() {
		dataset.articleStats.data.articles = dataset.articles.length;
		dataset.articleStats.data.undecided = 0;
		dataset.articleStats.data.confirmed = 0;
		dataset.articleStats.data.dismissed = 0;

		for (let i = 0; i < dataset.articles.length; i++) {
			if (typeof dataset.articles[i]._.confirmed === "undefined") {
				dataset.articleStats.data.undecided += 1;
			} else if (dataset.articles[i]._.confirmed === true) {
				dataset.articleStats.data.confirmed += 1;
			} else if (dataset.articles[i]._.confirmed === false) {
				dataset.articleStats.data.dismissed += 1;
			}
		}
	};

	dataset.isReadyToUpload = function() {
		return (dataset.articleStats.data.undecided === 0) && (dataset.articleStats.data.confirmed > 0)
	};


	/**
	 * get journal data in uploadable form
	 * @param article  - optional - select only one article
	 * @returns {{data: *, articles: Array}}
	 */
	dataset.get = function(article) {

		function flatten(obj) {
			let newObj = {};
			angular.forEach(obj, function(value, key) {
				newObj[key] = angular.isFunction(value.get) ? value.get() : value;
			});
			return newObj;
		}

		return {
            metadata: flatten(dataset.data),
			parts: Object.keys(dataset.articles)
				.filter(function(i) {return dataset.articles[i]._.confirmed === true})
				.filter(function (i) {return (typeof this._ !== "undefined") ? (this._.id === dataset.articles[i]._.id) : true}.bind(article))
				.map(function(i) {return flatten(dataset.articles[i])})
		}

	};

	dataset.getModel = function() {
	    return model;
    };

	/* Sub-Object functions */
	dataset.cleanArticles = function() {
		angular.forEach(dataset.articles, function(article, k) {
			if (typeof article._ !== "undefined") {
				article._ = {};
			}
		});
	};

	dataset.deleteArticle = function(article) {
		// the price for using an array for articles...
		for (let i = 0; i < dataset.articles.length; i++) {
			if (article === dataset.articles[i]) {
				break;
			}
		}
		dataset.undoDeleteArticle = dataset.articles[i];
		dataset.articles.splice(i, 1);
	};


	/* Article constructor function */
	dataset.Article =  function(data) {
		data = data || {};
		function guid() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}

        articlePrototype = new model.SubObjectPrototype(data, dataset.data, dataset);
		Object.defineProperty(articlePrototype, '_', {enumerable: false, configurable: false, value: {}});

		articlePrototype._.id = guid();

		function thumbnailDataObserver() {
			$rootScope.$broadcast('thumbnaildataChanged', articlePrototype)
		}

		articlePrototype.filepath.watch(thumbnailDataObserver);
		articlePrototype.pages.watch(thumbnailDataObserver);

		return (articlePrototype);
	};

	/* all function above could me generalized to work with different models */

    dataset.setConstraints  = model.setConstraints;


	dataset.reset();

	return (dataset);
}]);
