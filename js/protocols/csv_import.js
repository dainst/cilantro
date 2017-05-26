var mod = angular.module('module.protocols.csv_import', ['ui.bootstrap']);


mod.factory("csv_import", ['$rootScope', '$uibModal', 'editables', 'protocolregistry', 'documentsource', 'journal', 'messenger',
	function($rootScope, $uibModal, editables, protocolregistry, documentsource, journal, messenger) {

		var journalCtrl = new protocolregistry.Protocol('csv_import');

		journalCtrl.description = "Import data is stored in CSV";

		journalCtrl.columns = ['author', 'title', 'pages'];

		journalCtrl.onSelect = function() {

		}

		journalCtrl.onInit = function() {
			documentsource.getDocuments(journal.data.importFilePath);
		}

		journalCtrl.onGotFile = function(fileName) {
			console.log(fileName)
		}

		journalCtrl.onAll = function() {

			let modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'partials/csv_import.html',
				controller: "csv_import_window",
				controllerAs: '$ctrl',
				size: 'lg'
			});

			modalInstance.result.then(function (filled_columns) {
				journalCtrl.columns = filled_columns;
				for (let i = 0, ids = Object.keys(journal.articles); i < ids.length; i++) {
					$rootScope.$broadcast('thumbnaildataChanged', journal.articles[ids[i]]);
				}
				journalCtrl.ready = true;
			}, function (a) {
				journalCtrl.ready = true;
			});

		}


		return journalCtrl

	}])
.run(function(csv_import) {csv_import.register()});

mod.controller('csv_import_window', ['$scope', '$uibModalInstance', 'journal', function($scope, $uibModalInstance, journal) {

	/* raw csv data */
	$scope.raw_csv = "000371801";
	/* csv as array of arrays */
	$scope.csv = [];

	/* modal views state info */
	$scope.state = {
		parseOptions: false,
		tab: 'file', // raw|file|csv
		unequalFieldsWarning: true
	}

	/* chosen / detected columns types */
	$scope.cols_types = {}

	/* available column types */
	let cols_types = Object.keys(new journal.Article()).concat(["pageTo", "pageFrom"])
	for (let i = 0; i < cols_types.length; i++) {
		$scope.cols_types[normalize(cols_types[i])] = cols_types[i];
	}
	//console.log($scope.cols_types)


	$scope.columns = {}

	/* parse options */
	$scope.options = {
		delimiter: ',',
		authorsDelimiter: ';',
		ignoreFirstRow: false,
		authorFormat: '0',
		autoFetchFromZenon: false
	}

	$scope.delimiters = {
		',': 		',',
		';': 		';',
		'|': 		'\u007C',
		':': 		'\u003A',
		'{tab}': 	'\u0009'
	}

	/* constrols */
	$scope.ok = function() {
		CSV2Articles();
		$uibModalInstance.close();
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.parse = function () {
		$scope.csv = CSVToArray($scope.raw_csv, $scope.options.delimiter);
		analyzeCSV();
		$scope.state.tab= 'csv';
	}

	$scope.clickTab = function(tab) {
		if (tab === 'csv' && $scope.csv.length === 0) {
			return;
		}
		$scope.state.tab = tab;
	}

	$scope.toggleParseOptions = function() {
		$scope.state.parseOptions = !$scope.state.parseOptions
	}

	$scope.selectField = function(field, columnId) {
		console.log(field);
		if (field === '_dismiss') {
			return;
		}
		for (let i = 0, cols = Object.keys($scope.columns); i < cols.length; i++) {
			let col = $scope.columns[cols[i]];
			if ((i !== columnId) && (col.selected === field)) {
				col.selected = '';
			}
		}
	}

	$scope.hasZenonId = function() {
		for (let i = 0, cols = Object.keys($scope.columns); i < cols.length; i++) {
			if ($scope.columns[cols[i]].selected === "zenonid") {
				return true
			}
		}
		return false
	}


	$scope.onGotCsv = function(r) {
		$scope.raw_csv = r.data.csv;
		$scope.options.delimiter = guessDelimiter(r.data.csv);
		console.log(guessDelimiter(r.data.csv));
		$scope.state.tab = 'raw';
	}

	/* mighty functions */

	function analyzeCSV() {
		// order by cols
		let columns = {}
		$scope.columns = {}

		for (let i = 0; i < $scope.csv.length; i++) {
			if (i === $scope.csv.length - 1 && $scope.csv[i].length === 1 && $scope.csv[i][0] === '') {
				continue; // last line break shall not construct a empty value
			}
			for (let j = 0; j < $scope.csv[i].length; j++) {
				if (angular.isUndefined($scope.columns[j])) {
					$scope.columns[j] = {values: [$scope.csv[i][j]], selected: ''}
				} else {
					$scope.columns[j].values.push($scope.csv[i][j]);
				}
			}
		}

		// analyze
		let equal_length = true;
		let last_length = 0;
		let numbersFieldFound = false;
		let numberFields = ['pageto', 'pagefrom'];
		let boolFields = ['createfrontpage', 'autopublish'];
		let longTextFields = ['abstract', 'title'];
		let areHeadlines = true;

		for (let i = 0, cols = Object.keys($scope.columns); i < cols.length; i++) {
			let col = $scope.columns[cols[i]];
			col.length = col.values.length;
			equal_length = (last_length === 0) || (last_length === col.length);
			last_length = col.length;


			// make assumptions what this columns may contain

			// 1. may the first row be a headline
			let assumed_headline = normalize(col.values[0]);
			if ((typeof $scope.cols_types[assumed_headline] !== 'undefined') && areHeadlines) {
				$scope.columns[cols[i]].selected = assumed_headline;
				continue;
			}
			areHeadlines = false;

			// 2. small numbers should be page numbers
			let areNumbers = col.values.reduce(function(agg, v){let vv = Number(v); return agg && angular.isNumber(vv) && !isNaN(vv) && (vv <= 9999)}, true);
			if (areNumbers && numberFields.length) {
				$scope.columns[cols[i]].selected = numberFields.pop();
				continue;
			}

			// 3. big numbers = zenonIds
			let areIds = col.values.reduce(function(agg, v){let vv = Number(v); return agg && angular.isNumber(vv) && !isNaN(vv) && (vv > 9999)}, true);
			if (areIds) {
				$scope.columns[cols[i]].selected = 'zenonid';
				continue;
			}

			// 4. filepath
			let arePaths = col.values.reduce(function(agg, v){return agg && v.match(/\.pdf$/)}, true);
			if (arePaths) {
				$scope.columns[cols[i]].selected = 'filepath';
				continue;
			}

			// 5. booleans
			let areXs = col.values.reduce(function(agg, v){return agg && ((v.toLowerCase() === 'x') || (v  === ''))}, true);
			let are1s = col.values.reduce(function(agg, v){return agg && (['1', '0', 1, 0].indexOf(v) !== -1)}, true);
			let areTs = col.values.reduce(function(agg, v){return agg && (['true', 'false'].indexOf(v.toLowerCase()) !== -1)}, true);
			if (areXs || are1s || areTs) {
				$scope.columns[cols[i]].selected = boolFields.pop();
				continue;
			}

			// 6. filepath
			let areLangs = col.values.reduce(function(agg, v){return agg && v.match(/^[a-z][a-z]_[A-Z][A-Z]$/)}, true);
			if (areLangs) {
				$scope.columns[cols[i]].selected = 'language';
				continue;
			}

			// 7. Authors
			let nameRegex = new RegExp('^(([A-Z][a-z]{0,12}\\.?\\,?){1,3}\\' + $scope.options.authorsDelimiter + '?\\s?)+$');
			let areNames = col.values.reduce(function(agg, v){return agg && v.match(nameRegex)}, true);
			if (areNames) {
				$scope.columns[cols[i]].selected = 'author';
				continue;
			}

			// 8. pages
			let pageRegex = /^\d{1,3}(\s?[\-\u2013\u2212]\s?\d{1,3})?$/;
			let arePages = col.values.reduce(function(agg, v){return agg && v.match(pageRegex)}, true);
			if (arePages) {
				$scope.columns[cols[i]].selected = 'pages';
				continue;
			}
			console.log(arePages, col)

			// 9. longtext
			let arelongTexts = col.values.reduce(function(agg, v){return agg && (v.length > 8)}, true);
			if (arelongTexts) {
				$scope.columns[cols[i]].selected = longTextFields.pop();;
				continue;
			}

		}

		$scope.options.ignoreFirstRow = areHeadlines;
		$scope.state.unequalFieldsWarning = !equal_length;
	}


	// from https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
	function CSVToArray(strData, strDelimiter) {
		strDelimiter = (strDelimiter || ",");
		let objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
				// Standard fields.
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
		);
		let arrData = [[]];
		let arrMatches = null;
		let strMatchedValue;
		while (arrMatches = objPattern.exec( strData )){
			let strMatchedDelimiter = arrMatches[1];
			if (strMatchedDelimiter.length && (strMatchedDelimiter !== strDelimiter)){
				arrData.push([]);
			}

			if (arrMatches[2]){
				strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
			} else {
				strMatchedValue = arrMatches[3];
			}
			strMatchedValue = (typeof strMatchedValue !== "undefined") ? strMatchedValue : '';

			arrData[arrData.length - 1].push(strMatchedValue);
		}
		return (arrData);
	}

	function CSV2Articles() {
		Object.keys(journal.settings.overviewColumns).map(function(key) {
			journal.settings.overviewColumns[key].checked = false;
		});

		for (let r = ($scope.options.ignoreFirstRow ? 1 : 0); r < $scope.csv.length; r++) {
			let article = new journal.Article();

			for (let i = 0, cols = Object.keys($scope.columns); i < cols.length; i++) {
				let col = $scope.columns[cols[i]].selected;
				let prop = $scope.cols_types[col];

				if (typeof $scope.csv[r][cols[i]]  === "undefined") {
					return;
				}

				if (!angular.isUndefined(article[prop])) {
					//console.log($scope.csv[r][cols[i]]);
					if (col === 'author') {
						article[prop].set($scope.csv[r][cols[i]].split($scope.options.authorsDelimiter),  Number($scope.options.authorFormat));
					} else if (col === "pages") {
						let pages = $scope.csv[r][cols[i]].match(/^(\d{1,3})\s?[\-\u2013\u2212]?\s?(\d{1,3})?$/)
						article.pages.value.startPdf = parseInt(pages[1]);
						if (typeof pages[2] !== "undefined") {
							article.pages.value.endPdf = parseInt(pages[2]);
						}
					} else {
						article[prop].set($scope.csv[r][cols[i]]);
					}

					if (col === 'zenonid' && $scope.options.autoFetchFromZenon) {
						article._.autoFetchFromZenon = true; //!
					}

					journal.settings.overviewColumns[prop].checked = true;

				} else if (col === "pagefrom") {
					article.pages.value.startPdf = parseInt($scope.csv[r][cols[i]]);
					journal.settings.overviewColumns.pages.checked = true;

				} else if (col === "pageto") {
					article.pages.value.endPdf = parseInt($scope.csv[r][cols[i]]);
					journal.settings.overviewColumns.pages.checked = true;

				}

			}

			journal.articles.push(article);
		}
	}

	function guessDelimiter(strData) {
		return Object.keys($scope.delimiters)
			.map(function(key) {
					return {
						count: (this.strData.match(new RegExp("\\" + $scope.delimiters[key], "g")) || []).length,
						char: $scope.delimiters[key]
					}
				}.bind({strData: strData})
			)
			.reduce(function(a,b){return a.count > b.count ? a : b})
			.char
	}

	function normalize(term) {
		return term.toLowerCase().replace(/[^a-z]/g, '');
	}


}])

