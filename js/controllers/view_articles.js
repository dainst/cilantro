angular

.module('controller.view_articles', [])

.controller('view_articles', ['$scope', 'messenger', 'dataset', 'steps', 'labels', 'zenon_importer',
    function($scope, messenger, dataset, steps, labels, zenonImporter) {

        $scope.dataset = dataset;

        $scope.labels = labels;

        $scope.currentArticle = -1;

        $scope.zenonResult = {};

        $scope.searchObject = {};

        function updateSearchObject() {
            $scope.searchObject = {
                term: ($scope.currentArticle === -1) ? "" : dataset.articles[$scope.currentArticle].title.value.value
            };
        }

        $scope.init = () => {
            messenger.ok();
            $scope.selectArticle(0);
        };

        $scope.continue = () => {
            steps.change('publish');
        };

        $scope.addArticle = function() {
            const subObject = new dataset.Article({title: 'Article ' + (dataset.articles.length+1)});
            dataset.articles.push(subObject);
            $scope.selectArticle(dataset.articles.length -1);
            return subObject;
        };

        $scope.selectArticle = function(k) {
            if (!dataset.articles.length || k > (dataset.articles.length - 1)) k = -1;
            if (k === -1) return;
            
            $scope.currentArticle = k;

            updateSearchObject();

            // if (dataset.articles[$scope.currentArticle]._.autoFetchFromZenon && dataset.articles[$scope.currentArticle].zenonId.value.value !== '') {
            //     $scope.autoFetchFromZenon()
            // } else if (!dataset.articles[$scope.currentArticle]._.reportToZenon) {
            //     $scope.compareWithZenon();
            // }
        };

        $scope.selectNextUnconfirmedArticle = function() {
            for (let i = $scope.currentArticle; i < dataset.articles.length; i++) {
                if (typeof dataset.articles[i]._.confirmed === "undefined") {
                    return $scope.selectArticle(i)
                }
            }
            for (let i = 0; i < $scope.currentArticle; i++) {
                if (typeof dataset.articles[i]._.confirmed === "undefined") {
                    return $scope.selectArticle(i)
                }
            }
            $scope.currentArticle = -1;
        };

        $scope.isArticleSelected = function() {
            return ($scope.currentArticle !== -1) && (dataset.articles.length > 0)
        };

        $scope.checkArticle = function() {
            let article = dataset.articles[$scope.currentArticle];
            let invalid = 0;
            angular.forEach(article, function(property, id) {
                if ((typeof property !== "undefined") && (typeof property.check === "function") && (property.check() !== false)) {
                    invalid += 1;
                }
            });
            return (invalid === 0);
        };

        $scope.confirmArticle = function() {
            let article = dataset.articles[$scope.currentArticle];

            if (article) {
                article._.confirmed = true;
            }

            if (dataset.getStats().undecided === 0){
                $scope.continue();
            } else {
                $scope.selectNextUnconfirmedArticle();
            }

        };

        $scope.dismissArticle = function() {
            console.log('Delete Article ' + $scope.currentArticle);
            $scope.resetZenon();

            dataset.articles[$scope.currentArticle]._.confirmed = false;

            if (dataset.getStats().undecided === 0){
                $scope.continue();
            } else {
                $scope.selectNextUnconfirmedArticle();
            }
        };

        $scope.openFullFile = url => {window.open(url)};

        $scope.adoptFromZenon = () => {
            dataset.mapSubObject("zenon", zenonImporter.convert($scope.zenonResult), dataset.articles[$scope.currentArticle]);
        };

        $scope.newFromZenon = () => {
            dataset.mapSubObject("zenon", zenonImporter.convert($scope.zenonResult), $scope.addArticle());
        };

        $scope.markAsMissingZenon = () => {
            if (!dataset.articles[$scope.currentArticle]._.reportToZenon) {
                dataset.articles[$scope.currentArticle].zenonId.value.value = '[marked as missing]';
                dataset.articles[$scope.currentArticle]._.reportToZenon = true;
            } else {
                dataset.articles[$scope.currentArticle].zenonId.value.value = '';
                dataset.articles[$scope.currentArticle]._.reportToZenon = false;
            }

        };

    }
]);
