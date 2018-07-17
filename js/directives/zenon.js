angular
    .module('directive.zenon', [])
    .directive("zenon", ['$http', '$sce', '$timeout', 'messenger', 'settings',
        function($http, $sce, $timeout, messenger, settings) {
            return {
                restrict: 'E',
                templateUrl: 'partials/elements/zenon.html',
                scope: {
                    search: '<', // {term: "", id: ""}
                    result: '='
                },
                link: function (scope, element, attrs) {

                    const zenonEndpoint = $sce.trustAsResourceUrl(settings.zenon_url);

                    scope.results = [];
                    scope.selectedResult = -1;
                    scope.found = 0;
                    scope.start = 0;
                    scope.searchTimeout = false;

                    scope.$watchCollection("search", (oldValue, newValue, scope) => {
                        scope.resetResults(scope.search);
                        if (!scope.searchTimeout) {
                            scope.searchTimeout = true;
                            $timeout(scope.doSearch, 1000)
                        }
                    });

                    scope.resetResults = () => {
                        scope.results = [];
                        scope.found = 0;
                        scope.start = 0;
                        scope.selected = -1;
                    };

                    scope.doSearch = function(more) {

                        scope.resetResults();
                        scope.searchTimeout = false;

                        //dataset.articles[scope.currentArticle]._.reportToZenon = false; // @ TODO

                        if (!scope.search || !scope.search.term) return;

                        console.log('Zenon search for term: ' + scope.search.term);

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
                                "field[]": ['id', 'title', 'authors', 'summary', 'formats', 'series', 'languages', 'urls',
                                    'subjects', 'physicalDescriptions', 'placesOfPublication', 'cleanIsbn', 'cleanDoi',
                                    'cleanIssn', 'containerStartPage', 'containerEndPage', 'publicationDates'
                                ],
                            }
                        })
                            .then(response => {
                                    console.log('success', response);
                                    const data = response.data;
                                    scope.results = scope.results.concat(data.records || []);
                                    scope.found = parseInt(data.resultCount);
                                    //scope.start = parseInt(data.responseHeader.params.start) + 10;
                                    if (scope.found === 1) {
                                        //scope.selectFromZenon(0); // @ TODO
                                    }
                                },
                                err => {
                                    scope.resetResults();
                                    console.error(err);
                                    messenger.error('Could not connect to Zenon!');
                                }
                            );

                    };

                    scope.select = index => {
                        scope.selected = (scope.selected === index) ? -1 : index;
                        scope.result = scope.results[scope.selected];
                        // dataset.articles[scope.currentArticle].zenonId.value.value =
                        //     (scope.selectedResult === -1) ? '' : scope.results.results[index].id; TODO

                    };

                    scope.displayRecord = record => ({
                        Id: record.id && record.id,
                        Title: record.title && record.title,
                        Authors: record.authors && Object.keys(record.authors.primary || [])
                            .concat(Object.keys(record.authors.secondary || []))
                            .concat(Object.keys(record.authors.corporate || []))
                            .join("; "),
                        Format: record.formats && record.formats.join("; "),
                        Languages: record.languages && record.languages.join("; "),
                        Series: record.series && record.series.map(series => series.name + " " + series.number).join("; "),
                        Subjects: record.subjects && record.subjects.map(subject => subject[0]).join("; "),
                        Summary: record.summary && record.summary[0],
                        Urls: record.urls && record.urls.map(url => "<a href='" + url.url + " target='_blank'>" + url.desc + "</a>").join("<br>"),
                        PhysicalDescription: record.physicalDescriptions && record.physicalDescriptions.join("; "),
                        Places: record.placesOfPublication && record.placesOfPublication.map(place => place.replace(" :", "")).join("; "),
                        ISBN: record && record.cleanIsbn,

                    });

                    scope.lookUpInZenon = (id) => {window.open("https://zenon.dainst.org/Record/" + id)};


                }
            }
        }
    ]);