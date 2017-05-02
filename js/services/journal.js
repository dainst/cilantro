angular
.module("module.journal", [])
.factory("journal", ['editables', function(editables) {

	var  journal = {
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
			angular.forEach(journal.data, function (property) {
				if (angular.isObject(property) && (property.check() !== false)) {
					invalid += 1;
				}
			})
			return (invalid == 0);
		}
	}


	/* articles */
	journal.articles = [];
	journal.thumbnails = {}; /* they are not part of the article obj since they are very large and iterating over the
								articles array in the digest give performance issues otherwise! */

	journal.articleStats = {
		data: {
			articles: journal.articles.length,
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
			journal.articleStats.data.articles = journal.articles.length;
			journal.articleStats.data.undecided = 0;
			journal.articleStats.data.confirmed = 0;
			journal.articleStats.data.dismissed = 0;

			for (var i = 0; i < journal.articles.length; i++) {
				if (typeof journal.articles[i]._.confirmed === "undefined") {
					journal.articleStats.data.undecided += 1;
				} else if (journal.articles[i]._.confirmed === true) {
					journal.articleStats.data.confirmed += 1;
				} else if (journal.articles[i]._.confirmed === false) {
					journal.articleStats.data.dismissed += 1;
				}
			}
		}

	}

	journal.cleanArticles = function() {
		angular.forEach(journal.articles, function(article, k) {
			if (typeof article._ !== "undefined") {
				article._ = {};
			}
		});
	}

	journal.deleteArticle = function(article) {
		// the price for using an array for articles...
		for (var i = 0; i < journal.articles.length; i++) {
			if (article === journal.articles[i]) {
				break;
			}
		}
		journal.undoDeleteArticle = journal.articles[i];
		journal.articles.splice(i, 1);
	}



	/* prototype contructur functions */
	journal.Article =  function(data) {

		function guid() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
		}


		data = data || {};
		var articlePrototype = {
			'title':			editables.base(data.title),
			'abstract':			editables.text(data.abstract, false),
			'author':			editables.authorlist(data.author),
			'pages':			editables.page(data.pages),
			'date_published':	editables.base(data.date_published || 'DD-MM-YYYY'),
			'language':			editables.language('de_DE', false),
			'auto_publish':		editables.checkbox(journal.data.default_publish_articles === true),
			'filepath':			journal.data.importFilePath,
			'attached':			editables.filelist(),
			'order':			editables.number(0, false),
			'createFrontpage':	editables.checkbox(journal.data.create_frontpage === true),
			'zenonId':			editables.base('', false),
		}
		Object.defineProperty(articlePrototype, '_', {enumerable: false, configurable: false, value: {}});

		articlePrototype._.id = guid();

		return (articlePrototype);
	}

	return (journal);
}])
function hashcode(obj) {
	var chars = JSON.stringify(obj).replace(/\{|\"|\}|\:|,/g, '');
	var hash = 0;
	if (chars.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = chars.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}
