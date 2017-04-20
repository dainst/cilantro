
/*
$scope.repository = [];

pimportws.updateRepository = function(repository, selected) {
	$scope.repository = pimportws.repository = repository;
	$log.log("sel", selected);
	if (typeof selected !== "undefined") {
		$scope.journal.importFilePath = selected;
	}
}
*/
$scope.sessionLocked = false;


var master = null;
/*
$scope.journals = {
	types : {
		"chiron_parted": "Chiron, already parted into files",
		"chiron": "Chiron, whole Volume in one file",
		"testdata": "Create some testdata",
		"generic": "Generic"
	},
	chosen: 'generic'
};
*/

/* tabs */
/*
$scope.tabs = [
	{"template": "partials/home.html",		"title": "Start"},
	{"template": "partials/overview.html",	"title": "PDF overview"},
	{"template": "partials/articles.html",	"title": "Edit Articles"},
	{"template": "partials/xml.html",		"title": "Publish"}
];
/*
$scope.currentTab = 0;

$scope.changeTab = function(to) {
	$log.log('Tab change to: ' + $scope.tabs[to].title);
	$scope.server = {};
	$scope.currentTab = to;
}

$scope.nextTab = function() {
	$scope.server = {};
	$log.log('DEPRICATED Next Tab' + $scope.tabs[$scope.currentTab + 1]);
	$scope.currentTab += 1;
}
*/
/* security */

$scope.sec = pimportws.sec;

/**
 * Start Button Clicked
 */
$scope.startImport = function() {
	//checkPW
	pimportws.get('checkStart', {'file': $scope.journal.importFilePath, 'unlock': true, 'journal': $scope.journal}, function(response) {
		if (response.success) {
			$scope.sec.response  = '';
			$scope.loadJournalService();
			$log.log($scope.journal);

			// load next page
			$scope.changeTab(1);
			$log.log('starting');
		} else {

			$scope.sec.password = '';
			$scope.sec.response  = response.message;
		}
	});
}


$scope.loadJournalService = function() {
	// get journal specific service
	$log.log('load journal service ' +  $scope.journals.chosen);
	protocol.set($scope.journals.chosen);


	//master.nextTab = $scope.nextTab;
	//master.forwardArticle = $scope.addArticle;
	//master.journal = $scope.journal;
	//master.openFullFile = $scope.openFullFile;

	protocol.control.init();

	// right template
	// V2 Update: einzelne journalctrols sollen keine eigene templates mehr haben
	//$scope.tabs[1].template = master.template;
};








/* articles */

$scope.articles = [];
$scope.articlesConfirmed = [];

$scope.currentArticle = -1;



$scope.addArticle = function(b, select) {
	var a = new Article('Article ' +  $scope.articles.length);

	if (!angular.isUndefined(b)) {
		angular.extend(a, b);
	}
	$scope.articles.push(a);
	$log.log('Add Article ');
	if (select) {
		$scope.selectArticle($scope.articles.length -1);
	}
}

$scope.selectArticle = function(k) {
	$log.log(k);
	$scope.currentArticle = k;
	$scope.compareWithZenon();
}

$scope.dismissArticle = function() {
	$log.log('Delete Article ' + $scope.currentArticle);
	$scope.resetZenon();
	$scope.articles.splice($scope.currentArticle, 1);
	$scope.currentArticle = 0;
	$scope.compareWithZenon();
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

	if (article) {
		// prepare for uploading
		delete article.thumbnail;
		article.pages.context = {offset: parseInt(article.pages.context.offset)}
		$scope.articlesConfirmed.push(article);

		$scope.articles.splice($scope.currentArticle, 1);
		$scope.currentArticle = 0;
		$scope.compareWithZenon();
	}
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
			$log.error(err);
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

	var set = {
		'title':			editables.base(doc.title),
		'abstract':			editables.text('', false),
		'author':			editables.authorlist(authors, 1),
		'pages':			editables.page(doc.pages),
		'date_published':	editables.base(doc.date),
		'language':			editables.language('de_DE', false),
		'auto_publish':		editables.checkbox(),
		'thumbnail':		$scope.articles[$scope.currentArticle].thumbnail,
		'filepath':			$scope.articles[$scope.currentArticle].filepath,
		'zenonId':			editables.base('', false),
		'attached':			[]
	}

	//$log.log(set);

	$scope.articles[$scope.currentArticle] = set;

	$scope.resetZenon();
};

$scope.markAsMissingZenon = function() {
	$scope.articles[$scope.currentArticle].zenonId.value.value = '(((new)))';
	//$scope.sendToZenon();
}


$scope.reportMissingToZenon = function() {
	angular.forEach($scope.articlesConfirmed, function(article) {
		if (article.zenonId.value.value == '(((new)))') {
			pimportws.get('sendToZenon', {journal: $scope.journal, article: article}, function(response) {
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

/* upload to ojs  */

$scope.server = {}
$scope.done = false;
$scope.dainstMetadata = {};

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
			$scope.dainstMetadata = response.dainstMetadata;
			$scope.reportMissingToZenon();
		}
	});
}

$scope.makeOjsUrl = function(id) {
	return window.settings.ojs_url + 'index.php/'+ $scope.journal.ojs_journal_code + '/article/view/' + id;
}

$scope.isObject = function(elem) {
	return (typeof elem === "object");
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

$scope.resetSession = function() {
	pimportws.get('resetSession', {'unlock':true}, function(r) {
		if (r.success) {
			location.reload();
		}
	});
}

$scope.getUploadId = function() {
	return pimportws.uploadId;
}

$scope.teest = editables.language();
