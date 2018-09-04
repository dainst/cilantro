angular

.module('controller.viewOverview', [])

.controller('viewOverview', ['$scope', 'settings', 'messenger', 'dataset', 'steps', 'labels',
    function($scope, settings, messenger, dataset, steps, labels) {

        $scope.dataset = dataset;

        $scope.overviewColumns = {};

        $scope.labels = labels;

        $scope.init = function() {
            Object.keys(new dataset.Subobject()).forEach(key => {
                $scope.overviewColumns[key] = {
                    'checked': !labels.getIsHidden("sub", key),
                    'title': labels.get("sub", key, true),
                    'description': labels.get("sub", key),
                    'label': labels.get("sub", key),
                    'style': labels.getStyle("sub", key),
                }
            });
        };

        /* tools & buttons */

        $scope.addArticle = function() {
            const a = new dataset.Subobject({title: 'Article ' + (dataset.subobjects.length+1)});
            dataset.subobjects.push(a);
        };

        $scope.continue = function() {
            dataset.cleanSubobjects();
            steps.change('articles');
        };

        // open file externally
        $scope.openDocument = function(article) {
            console.log("Open Document: " + article.filepath.value.value);
            window.open(settings.files_url + article.filepath.value.value);
        };

        /* merging articles */
        $scope.selectedToMerge = false;
        let mergeMessage = {};

        $scope.mergeArticle = function(article) {

            if ($scope.selectedToMerge && ($scope.selectedToMerge._.id === article._.id)) {
                messenger.ok();
                $scope.selectedToMerge = false;
                return;
            }

            if (!$scope.selectedToMerge)  {
                mergeMessage = messenger.push('Select another article to put it at the end of »' + article.title.get() + '«', "urgent", true);
                $scope.selectedToMerge = article;
            } else {
                let article2 = article;
                article = $scope.selectedToMerge;
                if (confirm('Really attach article »' + article2.title.get() + '« to the end of »' + article.title.get() + "« ?")) {
                    mergeArticles(article, article2);
                } else {
                    console.log("cancelled merging");
                    mergeMessage.text = "Merging Canceled";
                    mergeMessage.type = "info";
                    $scope.selectedToMerge = false;
                }
            }

        };


        function mergeArticles(main, attach)  {

            console.log('merge!', main, attach);
            $scope.selectedToMerge = false;

            main.attached.push({
                file: attach.filepath.value.value,
                from: attach.pages.value.startPdf,
                to:   attach.pages.value.endPdf
            });// we could add from and to, but we use the whole file anyway!

            $scope.removeArticle(attach);

            mergeMessage.text = 'Articles Merged!';
            mergeMessage.type = "success";
            $scope.selectedToMerge = false;
        }

        /* delete */
        $scope.removeArticle = function(article) {
            //dataset.deleteArticle(article)
            article._.confirmed = false;
        };

        /* thumbnail enlargement */
        $scope.selectedThumb = -1;
        $scope.selectThumb = i => {$scope.selectedThumb = (i === $scope.selectedThumb) ? -1 : i};

        /* sort */
        $scope.updateOrder = (orderBy, asc) => {dataset.sortSubObjects(orderBy, asc)};

        $scope.moveArticle = (article, up) => {
            angular.forEach(dataset.subobjects, (a, i) => {a.order.value.value = (i + 1)  * 10});
            article.order.value.value += up ? - 15 : 15;
            dataset.sortSubObjects('order');
        };

    }
]);
