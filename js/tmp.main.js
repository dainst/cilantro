
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
/*
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


*/





/* articles */



/* upload to ojs  */



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
