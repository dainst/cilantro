var mod = angular.module('module.protocols.csv_import', ['ui.bootstrap']);


mod.factory("csv_import", ['$rootScope', '$uibModal', 'editables', 'protocolregistry', 'documentsource', 'journal',
	function($rootScope, $uibModal, editables, protocolregistry, documentsource, journal) {

		var journalCtrl = new protocolregistry.Protocol('csv_import');

		journalCtrl.description = "Import data is stored in CSV";

		journalCtrl.columns = ['author', 'title', 'pages'];

		journalCtrl.onSelect = function() {

		}

		journalCtrl.onInit = function() {
			//documentsource.getDocuments(journal.data.importFilePath);
			console.log('go modal');

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'partials/csv_import.html',
				controller: "csv_import_window",
				controllerAs: '$ctrl',
				size: 'lg'
			});

			modalInstance.result.then(function (filled_columns) {
				console.log(filled_columns);
				journalCtrl.columns = filled_columns;
			}, function (a) {
				console.log('E',a)
			});


		}

		journalCtrl.onGotFile = function(fileName) {
			console.log(fileName)
		}


		return journalCtrl

	}])
.run(function(csv_import) {csv_import.register()});

mod.controller('csv_import_window', ['$scope', '$uibModalInstance', 'journal', function($scope, $uibModalInstance, journal) {

	$scope.raw_csv =
					//'author, title, pageFrom, pageTo' + "\n" +
 					'"John Smith", "eine Überschrift", 125, 255, "lol.pdf", true, x, de_DE'
					+ "\n" +
					'"Peter Lustig", "Chronontology", 256, 300, "peter/parker.pdf", false, "", en_EN';
	$scope.csv = [];


	$scope.cols_types = {}
	var cols_types = Object.keys(new journal.Article())
		.concat(["pageTo", "pageFrom"])

	for (let i = 0; i < cols_types.length; i++) {
		$scope.cols_types[normalize(cols_types[i])] = cols_types[i];
	}


	console.log($scope.cols_types)

	$scope.columns = {}

	$scope.delimiter = ', ';
	$scope.separator = '\n';

	$scope.ok = function() {

		let filled_columns = [];

		for (let r = 0; r < $scope.csv.length; r++) {
			var article = new journal.Article();

			for (let i = 0, cols = Object.keys($scope.columns); i < cols.length; i++) {
				let col = $scope.columns[cols[i]].selected;
				let prop = $scope.cols_types[col];
				console.log(col,  prop);
				if (col === '' || col === '_dimissed') {
					continue;
				}
				if (!angular.isUndefined(article[prop])) {
					console.log($scope.csv[r][cols[i]]);
					article[prop].set($scope.csv[r][cols[i]]);
					filled_columns.push(prop);
					continue;
				}


			}

			journal.articles.push(article);
		}
		$uibModalInstance.close(filled_columns);
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.parse = function () {
		$scope.csv = CSVToArray($scope.raw_csv, $scope.delimiter);
		analyzeCSV();
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

	function analyzeCSV() {
		// order by cols
		var columns = {}

		for (let i = 0; i < $scope.csv.length; i++) {
			for (let j = 0; j < $scope.csv[i].length; j++) {
				if (angular.isUndefined($scope.columns[j])) {
					$scope.columns[j] = {values: [$scope.csv[i][j]], selected: ''}
				} else {
					$scope.columns[j].values.push($scope.csv[i][j]);
				}
			}
		}

		// analyze
		var equal_length = true;
		var last_length = 0;
		var numbersFieldFound = false;
		var numberFields = ['pagefrom', 'pageto'];
		var boolFields = ['createfrontpage', 'autopublish'];

		for (let i = 0, cols = Object.keys($scope.columns); i < cols.length; i++) {
			let col = $scope.columns[cols[i]];
			col.length = col.values.length;
			equal_length = (last_length == 0) || (last_length == col.length);
			last_length = col.length;


			// make assumptions what this columns may contain

			// 1. may the first row be a headline
			let assumpted_headline = normalize(col.values[0]);
			if (typeof $scope.cols_types[assumpted_headline] !== 'undefined') {
				$scope.columns[cols[i]].selected = assumpted_headline;
				continue;
			}

			// 2. small numbers should be page numbers
			let areNumbers = col.values.reduce(function(agg, v){let vv = parseInt(v); return agg && angular.isNumber(vv) && !isNaN(vv) && (vv <= 9999)}, true);
			if (areNumbers && numberFields.length) {
				$scope.columns[cols[i]].selected = numberFields.pop();
				continue;
			}

			// 3. big numbers = zenonIds
			let areIds = col.values.reduce(function(agg, v){let vv = parseInt(v); return agg && angular.isNumber(vv) && !isNaN(vv) && (vv > 9999)}, true);
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

		}


		console.log(equal_length, $scope.columns)
	}


	// from https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
	function CSVToArray(strData, strDelimiter) {
		strDelimiter = (strDelimiter || ",");
		var objPattern = new RegExp(
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
		var arrData = [[]];
		var arrMatches = null;
		while (arrMatches = objPattern.exec( strData )){
			var strMatchedDelimiter = arrMatches[1];
			if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)){
				arrData.push( [] );
			}

			if (arrMatches[2]){
				var strMatchedValue = arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"");
			} else {
				// We found a non-quoted value.
				var strMatchedValue = arrMatches[3];
			}
			strMatchedValue = (typeof strMatchedValue !== "undefined") ? strMatchedValue : '';

			arrData[ arrData.length - 1 ].push( strMatchedValue );
		}
		return( arrData );
	}

	function normalize(term) {
		return term.toLowerCase().replace(/[^a-z]/g, '');
	}


}])

