var mod = angular.module('module.protocols.csv_import', ['ui.bootstrap']);


mod.factory("csv_import", ['$rootScope', '$uibModal', 'editables', 'protocolregistry', 'documentsource', 'journal',
	function($rootScope, $uibModal, editables, protocolregistry, documentsource, journal) {

		var journalCtrl = new protocolregistry.Protocol('csv_import');

		journalCtrl.description = "Import data is stored in CSV";

		journalCtrl.columns = ['author', 'title', 'pages'];

		journalCtrl.onInit = function() {
			documentsource.getDocuments(journal.data.importFilePath);
		}

		journalCtrl.onSelect = function() {
			console.log('go modal');

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'partials/csv_import.html',
				controller: "csv_import_window",
				controllerAs: '$ctrl',
				size: 'lg'
			});

			modalInstance.result.then(function (a) {
				console.log(a)
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
 					'"John Smith", "eine Überschrift", 125, 255, "lol.pdf"'
					+ "\n" +
					'"Peter Lustig", "Chronontology", 256, 300, "peter/baumeister.pdf"';

	$scope.cols_types = {}
	var cols_types = Object.keys(new journal.Article())
		.concat(["pageFrom", "pageTo"])

	for (let i = 0; i < cols_types.length; i++) {
		$scope.cols_types[normalize(cols_types[i])] = cols_types[i];
	}


	console.log($scope.cols_types)

	$scope.columns = {}

	$scope.delimiter = ', ';
	$scope.separator = '\n';

	$scope.ok = function() {
		$uibModalInstance.close('flubba');
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.parse = function () {
		$scope.result = CSVToArray($scope.raw_csv, $scope.delimiter);
		analyzeCSV($scope.result);
	}

	function analyzeCSV(csv) {
		// order by cols
		var columns = {}


		for (let i = 0; i < csv.length; i++) {
			for (let j = 0; j < csv[i].length; j++) {
				if (angular.isUndefined($scope.columns[j])) {
					$scope.columns[j] = {values: [csv[i][j]], selected: ''}
				} else {
					$scope.columns[j].values.push(csv[i][j]);
				}
			}
		}

		// analyze
		var equal_length = true;
		var last_length = 0;
		var numbersFieldFound = false;


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
			if (areNumbers && !numbersFieldFound) {
				$scope.columns[cols[i]].selected = 'pagefrom';
				numbersFieldFound = true;
				continue;
			} else if (areNumbers) {
				$scope.columns[cols[i]].selected = 'pageto';
				continue;
			}

			// 3. big numbers = zenonIds
			let areIds = col.values.reduce(function(agg, v){let vv = parseInt(v); return agg && angular.isNumber(vv) && !isNaN(vv) && (vv > 9999)}, true);
			if (areIds) {
				$scope.columns[cols[i]].selected = 'zenonid';
				continue;
			}

			// 4. filepath
			let arePaths = col.values.reduce(function(agg, v){console.log(v.match(/\.pdf$/));return agg && v.match(/\.pdf$/)}, true);
			if (arePaths) {
				$scope.columns[cols[i]].selected = 'filepath';
				continue;
			}

		}


		console.log(equal_length, $scope.columns)
	}


	// from https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
	// This will parse a delimited string into an array of
	// arrays. The default delimiter is the comma, but this
	// can be overriden in the second argument.
	function CSVToArray( strData, strDelimiter ){
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");
		// Create a regular expression to parse the CSV values.
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
		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [[]];
		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec( strData )){
			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[ 1 ];
			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (
				strMatchedDelimiter.length &&
				(strMatchedDelimiter != strDelimiter)
			){
				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push( [] );
			}
			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[ 2 ]){
				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				var strMatchedValue = arrMatches[ 2 ].replace(
					new RegExp( "\"\"", "g" ),
					"\""
				);
			} else {
				// We found a non-quoted value.
				var strMatchedValue = arrMatches[ 3 ];
			}
			// Now that we have our value string, let's add
			// it to the data array.
			arrData[ arrData.length - 1 ].push( strMatchedValue );
		}
		// Return the parsed data.
		return( arrData );
	}

	function normalize(term) {
		return term.toLowerCase().replace(/[^a-z]/g, '');/*
			.replace(/[^A-Za-z]/g,' ')
			.replace(/(.)/g, function(a, l) { return l; })
			.replace(/(\s.)/g, function(a, l) { return l.toUpperCase(); })
			.replace(/[^A-Za-z\u00C0-\u00ff]/g,'')  // from https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case*/
	}


}])

