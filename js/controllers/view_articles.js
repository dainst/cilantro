angular

.module('controller.view_articles', [])

.controller('view_articles', ['$scope', 'messenger', 'dataset', 'steps', 'labels',
    function($scope, messenger, dataset, steps, labels) {


        $scope.dataset = dataset;

        $scope.labels = labels;

        $scope.currentArticle = -1;

        $scope.zenonResult = {};

        $scope.init = () => {
            messenger.ok();
            $scope.selectArticle(0);
        };

        $scope.continue = () => {
            steps.change('publish');
        };

        $scope.addArticle = function() {
            const a = new dataset.Article({title: 'Article ' + (dataset.articles.length+1)});
            dataset.articles.push(a);
            $scope.selectArticle(dataset.articles.length -1);
        };

        $scope.selectArticle = function(k) {
            if (!dataset.articles.length || k > (dataset.articles.length - 1)) k = -1;
            if (k === -1) return;
            
            $scope.currentArticle = k;
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

        $scope.getSearchObject = () => ($scope.currentArticle === -1)
            ? {}
            : {
                id: dataset.articles[$scope.currentArticle].zenonId.value.value,
                term: dataset.articles[$scope.currentArticle].title.value.value
            };

        $scope.openFullFile = url => {window.open(url)};

        $scope.adoptFromZenon = function(index) {

            index = index || scope.selectedResult;

            let doc = scope.results.results[index];

            //console.log(doc);

            let authors = [];

            if (doc.author) {
                authors.push(doc.author);
            }

            if (doc.author2 && angular.isArray(doc.author2)) {
                authors = authors.concat(doc.author2);
            }

            let article = dataset.articles[scope.currentArticle];

            article.title.set(doc.title);
            // article.abstract.value.value = abstract; // @ TODO adopt abstract from zenon?
            article.author.setAuthors(authors, 1);
            article.pages.set(doc.pages.replace('.', ''));
            article.date_published.set(doc.date);
            //article.language = editables.language('de_DE', false); // @ TODO adopt language from zenon?


            //scope.resetZenon();
        };


        $scope.markAsMissingZenon = () => {
            dataset.articles[$scope.currentArticle].zenonId.value.value = '(((new)))';
            dataset.articles[$scope.currentArticle]._.reportToZenon = true;
        };

    }
]);
