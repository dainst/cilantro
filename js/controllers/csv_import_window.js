angular.module('controller.csvImportWindow', ['ui.bootstrap']);
mod.controller('csvImportWindow', ['$scope', '$uibModalInstance', 'dataset', 'file', 'labels', 'zenonImporter', 'messenger',
    function($scope, $uibModalInstance, dataset, file, labels, zenonImporter, messenger) {

        /* raw csv data */
        $scope.raw_csv = "";

        /* csv as array of arrays */
        $scope.csv = [];

        /* modal views state info */
        $scope.state = {
            parseOptions: false,
            tab: 'raw', // raw|csv
            unequalFieldsWarning: true
        };

        /* chosen / detected columns types */
        $scope.cols_types = {};

        /* available column types */
        let cols_types = Object.keys(new dataset.Subobject()).concat(["pageFrom", "pageTo"]);
        for (let i = 0; i < cols_types.length; i++) {
            $scope.cols_types[normalize(cols_types[i])] = cols_types[i];
        }

        $scope.columns = {};

        /* parse options */
        $scope.options = {
            delimiter: ',',
            guessedDelimiter: ',',
            authorsDelimiter: ';',
            ignoreFirstRow: false,
            authorFormat: '0',
            autoFetchFromZenon: false
        };

        $scope.delimiters = {
            ';': 		';',
            '|': 		'\u007C',
            ':': 		'\u003A',
            '{tab}': 	'\u0009',
            ',': 		','
        };

        /* controls */
        $scope.ok = () => {
            CSV2Articles().then($uibModalInstance.close);
        };

        $scope.cancel = () => $uibModalInstance.dismiss('cancel');

        $scope.parse = () => {
            $scope.csv = CSVToArray($scope.raw_csv, $scope.options.delimiter);
            analyzeCSV();
            $scope.state.tab= 'csv';
        };

        $scope.clickTab = tab => {
            if (tab === 'csv' && $scope.csv.length === 0) {
                return;
            }
            $scope.state.tab = tab;
        };

        $scope.toggleParseOptions = () => $scope.state.parseOptions = !$scope.state.parseOptions;

        $scope.selectField = (field, columnId) => {
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
        };

        $scope.hasZenonId = () => {
            for (let i = 0, cols = Object.keys($scope.columns); i < cols.length; i++) {
                if ($scope.columns[cols[i]].selected === "zenonid") {
                    return true
                }
            }
            return false
        };


        $scope.guessDelimiter = () => {
            $scope.options.guessedDelimiter = guessDelimiter($scope.raw_csv);
            $scope.options.delimiter = $scope.options.guessedDelimiter;
            console.log("guessed delimiter: ", $scope.options.delimiter);
        };

        $scope.getLabel = (key) => labels.get("sub", key);

        /* mighty functions */

        function analyzeCSV() {
            // order by cols
            let columns = {};
            $scope.columns = {};

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
            let numberFields = ['pagefrom', 'pageto'];
            let boolFields = ['create_frontpage', 'autopublish'];
            let longTextFields = ['abstract', 'title'];
            let areHeadlines = true;

            for (let i = 0, cols = Object.keys($scope.columns); i < cols.length; i++) {
                let col = $scope.columns[cols[i]];
                col.length = col.values.length;
                equal_length = equal_length && ((last_length === 0) || (last_length === col.length));
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

                // 3. ZenonIds
                let areIds = col.values.reduce((agg, v) => !!v.match(/^\w?\w?\d{9}$/) && agg, true);
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

                // 6. language
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
            while (arrMatches = objPattern.exec(strData)) {
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

        function getColumnId(field) {
            return Object.keys($scope.columns).filter(v => $scope.columns[v].selected === field).pop();
        }

        function CSV2Articles() {

            function fetchArticleFromZenon(id) {
                return new Promise((resolve, reject) =>
                    zenonImporter.get(false, id)
                        .then(
                            data => {
                                if (data.status !== "OK" || !data.records.length) resolve(null);
                                resolve(dataset.mapSubObject("zenon", zenonImporter.convert(data.records[0])));
                            },
                            err => {
                                messenger.warning("Record with id >>" + id + "<< could not fetched from zenon");
                                resolve(null);
                            }
                        )
                );
            }

            function newArticle() {
                return new Promise((resolve, reject) => {
                    resolve(new dataset.Subobject());
                })
            }

            function getArticleBase(row) {
                const zenonColumnId = getColumnId("zenonid");
                console.log("!!",zenonColumnId,angular.isDefined(zenonColumnId) , $scope.csv[row][zenonColumnId]);
                return ($scope.options.autoFetchFromZenon && angular.isDefined(zenonColumnId) && $scope.csv[row][zenonColumnId])
                    ? fetchArticleFromZenon($scope.csv[row][zenonColumnId])
                    : newArticle();
            }

            function fillArticleWithRow(r, article) {

                if (!article) return;

                for (let i = 0, cols = Object.keys($scope.columns); i < cols.length; i++) {
                    const col = $scope.columns[cols[i]].selected;
                    const prop = $scope.cols_types[col];

                    if (angular.isUndefined($scope.csv[r][cols[i]])) return;

                    if (!angular.isUndefined(article[prop])) {

                        if (col === 'author') {
                            article[prop].set($scope.csv[r][cols[i]].split($scope.options.authorsDelimiter), Number($scope.options.authorFormat));

                        } else if (col === "pages") {
                            let pages = $scope.csv[r][cols[i]].match(/^(\d{1,3})\s?[\-\u2013\u2212]?\s?(\d{1,3})?$/);
                            if (pages === null) {
                                pages = [$scope.csv[r][cols[i]]];
                            }
                            article.pages.value.startPdf = parseInt(pages[1]);
                            if (typeof pages[2] !== "undefined") {
                                article.pages.value.endPdf = parseInt(pages[2]);
                            }

                        } else {
                            article[prop].set($scope.csv[r][cols[i]]);
                        }

                    } else if (col === "pagefrom") {
                        article.pages.value.startPdf = parseInt($scope.csv[r][cols[i]]);

                    } else if (col === "pageto") {
                        article.pages.value.endPdf = parseInt($scope.csv[r][cols[i]]);
                    }

                }
                dataset.subobjects.push(article);
            }

            const articlePromises = [];
            for (let r = ($scope.options.ignoreFirstRow ? 1 : 0); r < $scope.csv.length; r++) {
                const articlePromise = getArticleBase(r);
                articlePromise.then(article => fillArticleWithRow(r, article));
                articlePromises.push(articlePromise);
            }
            return Promise.all(articlePromises);
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
                .reduce((a, b) => a.count > b.count ? a : b)
                .char
        }

        function normalize(term) {
            return term.toLowerCase().replace(/[^a-z]/g, '');
        }


        /* LOAD MODAL WITH DATA */
        $scope.raw_csv = file;
        $scope.guessDelimiter();


}]);
