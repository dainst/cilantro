angular

.module('controller.viewSubObjects', [])

.controller('viewSubObjects', ['$scope', 'messenger', 'dataset', 'steps', 'labels', 'zenonImporter',
    function($scope, messenger, dataset, steps, labels, zenonImporter) {

        $scope.dataset = dataset;

        $scope.labels = labels;

        $scope.currentArticle = -1;

        $scope.zenonResult = {};

        $scope.searchObject = {};

        $scope.$watch('zenonResult', (newValue, oldValue, scope) => {
            if (!scope.isArticleSelected()) return;
            dataset.subobjects[scope.currentArticle].zenonId.set((!newValue || !newValue.id) ? "" : newValue.id);
        });

        function updateSearchObject() {
            $scope.searchObject = {
                term: ($scope.currentArticle === -1) ? "" : dataset.subobjects[$scope.currentArticle].title.value.value
            };
        }

        $scope.init = () => {
            $scope.selectArticle(0);
        };

        $scope.continue = () => {
            steps.change('publish');
        };

        $scope.addArticle = function() {
            const subObject = new dataset.Subobject({title: 'Article ' + (dataset.subobjects.length+1)});
            dataset.subobjects.push(subObject);
            $scope.selectArticle(dataset.subobjects.length -1);
            return subObject;
        };

        $scope.selectArticle = function(k) {
            if (!dataset.subobjects.length || k > (dataset.subobjects.length - 1)) k = -1;
            if (k === -1) return;
            
            $scope.currentArticle = k;

            updateSearchObject();

            if (dataset.subobjects[$scope.currentArticle]._.confirmed)
                dataset.subobjects[$scope.currentArticle]._.confirmed = undefined;

        };

        $scope.selectNextUnconfirmedArticle = function() {
            for (let i = $scope.currentArticle; i < dataset.subobjects.length; i++) {
                if (typeof dataset.subobjects[i]._.confirmed === "undefined") {
                    return $scope.selectArticle(i)
                }
            }
            for (let i = 0; i < $scope.currentArticle; i++) {
                if (typeof dataset.subobjects[i]._.confirmed === "undefined") {
                    return $scope.selectArticle(i)
                }
            }
            $scope.currentArticle = -1;
        };

        $scope.isArticleSelected = function() {
            return ($scope.currentArticle !== -1) && (dataset.subobjects.length > 0)
        };

        $scope.checkArticle = function() {
            let article = dataset.subobjects[$scope.currentArticle];
            let invalid = 0;
            angular.forEach(article, function(property, id) {
                if ((typeof property !== "undefined") && (typeof property.check === "function") && (property.check() !== false)) {
                    invalid += 1;
                }
            });
            return (invalid === 0);
        };

        $scope.confirmArticle = () => {
            console.log('Confirm Article ' + $scope.currentArticle);
            if (angular.isUndefined(dataset.subobjects[$scope.currentArticle])) return;

            dataset.subobjects[$scope.currentArticle]._.confirmed = true;

            if ((dataset.getStats().undecided === 0) && dataset.getStats().confirmed) {
                $scope.continue();
            } else {
                $scope.selectNextUnconfirmedArticle();
            }

        };

        $scope.dismissArticle = () => {
            console.log('Dismiss Article ' + $scope.currentArticle);
            if (angular.isUndefined(dataset.subobjects[$scope.currentArticle])) return;

            dataset.subobjects[$scope.currentArticle]._.confirmed = false;

            if ((dataset.getStats().undecided === 0) && dataset.getStats().confirmed) {
                $scope.continue();
            } else {
                $scope.selectNextUnconfirmedArticle();
            }
        };

        $scope.undeleteArticle = () => {
            console.log('Undelete Article ' + $scope.currentArticle);
            if (angular.isUndefined(dataset.subobjects[$scope.currentArticle])) return;

            dataset.subobjects[$scope.currentArticle]._.confirmed = undefined;
        };

        $scope.openFullFile = url => {window.open(url)};

        $scope.adoptFromZenon = () => {
            dataset.mapSubObject("zenon", zenonImporter.convert($scope.zenonResult), dataset.subobjects[$scope.currentArticle]);
        };

        $scope.newFromZenon = () => {
            dataset.mapSubObject("zenon", zenonImporter.convert($scope.zenonResult), $scope.addArticle());
        };

        $scope.markAsMissingZenon = () => {
            if (!dataset.subobjects[$scope.currentArticle]._.reportToZenon) {
                dataset.subobjects[$scope.currentArticle].zenonId.value.value = '[marked as missing]';
                dataset.subobjects[$scope.currentArticle]._.reportToZenon = true;
            } else {
                dataset.subobjects[$scope.currentArticle].zenonId.value.value = '';
                dataset.subobjects[$scope.currentArticle]._.reportToZenon = false;
            }

        };

    }
]);
