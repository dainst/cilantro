angular
    .module('directive.zenon', [])
    .directive("zenon", ['$http', '$sce', 'messenger', 'settings',
        function($http, $sce, messenger, settings) {
            return {
                restrict: 'E',
                templateUrl: 'partials/elements/zenon.html',
                scope: {
                    search: '=', // {term: "", id: ""}
                },
                link: function (scope, element, attrs) {
                    
                    scope.results = [];
                    scope.selectedResult = -1;
                    scope.found = 0;
                    scope.start = 0;

                    const zenonEndpoint = $sce.trustAsResourceUrl(settings.zenon_url);

                    scope.resetZenon = search => {
                        scope.results = [];
                        scope.found = 0;
                        scope.start = 0;
                        scope.search = search || {};
                        scope.selected = -1;
                    };

                    scope.doSearch = function(more) {

                        scope.resetZenon(scope.search);

                        //dataset.articles[scope.currentArticle]._.reportToZenon = false; // @ TODO
                        
                        console.log('Zenon search for term:' + scope.search.term);

                        //dataset.articles[scope.currentArticle].zenonId.value.value = ''; // @ TODO

                        scope.selectedResult = -1;

                        $http({
                            method: 'GET',
                            url: zenonEndpoint,
                            params: {
                                lookfor: scope.search.term,
                                page: 1,
                                limit: 10,
                                type: "Title",
                                sort: "relevence",
                                "field[]": ['id', 'title', 'authors', 'summary', 'formats', 'series', 'languages', 'urls', 'subjects'],
                            }
                        })
                            .then(response => {
                                    console.log('success', response);
                                    const data = response.data;
                                    scope.results = scope.results.concat(data.records);
                                    scope.found = parseInt(data.resultCount);
                                    //scope.start = parseInt(data.responseHeader.params.start) + 10;
                                    if (scope.found === 1) {
                                        //scope.selectFromZenon(0); // @ TODO
                                    }
                                },
                                err => {
                                    console.error(err);
                                    messenger.error('Could not connect to Zenon!');
                                }
                            );

                    };

                    scope.select = index => {
                        scope.selected = (scope.selected === index) ? -1 : index;
                        // dataset.articles[scope.currentArticle].zenonId.value.value =
                        //     (scope.selectedResult === -1) ? '' : scope.results.results[index].id; TODO

                    };

                    scope.displayRecord = record => ({
                        Id: record.id && record.id,
                        Title: record.title && record.title,
                        Authors: record.authors && record.authors.primary && Object.keys(record.authors.primary).join("; "),
                        Format: record.formats && record.formats.join("; "),
                        Languages: record.languages && record.languages.join("; "),
                        Series: record.series && record.series.map(series => series.name + " " + series.number).join("; "),
                        Subjects: record.subjects && record.subjects.map(subject => subject[0]).join("; "),
                        Summary: record.summary && record.summary[0]
                    });


                    
                    



                    scope.adoptFromZenon = function (index) {

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

                    scope.markAsMissingZenon = function () {
                        dataset.articles[scope.currentArticle].zenonId.value.value = '(((new)))';
                        dataset.articles[scope.currentArticle]._.reportToZenon = true;
                        //scope.sendToZenon();
                    };
                }
            }
        }
    ]);