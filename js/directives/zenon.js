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
                    scope.selected = -1;
                    scope.found = 0;
                    scope.page = 0;
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
                        scope.page = 0;
                        scope.selected = -1;
                    };

                    function createRequestParams() {
                        const isId = term => !!term.match(/^\w?\w?\d{9}$/);
                        const request = {};
                        request.method = 'GET';
                        request.params = {};

                        if (!scope.search.id && !isId(scope.search.term)) {
                            request.url = zenonEndpoint + 'search';
                            request.params.lookfor = scope.search.term;
                            request.params.page = scope.page;
                            request.params.limit = 10;
                            request.params.type = "Title";
                            request.params.sort = "relevence";
                        } else {
                            console.log("zenon search for id ", scope.search);
                            request.url = zenonEndpoint + 'record';
                            request.params.id = scope.search.id || scope.search.term
                        }
                        request.params["field[]"] = ['id', 'title', 'authors', 'summary', 'formats', 'series',
                            'languages', 'urls', 'subjects', 'physicalDescriptions', 'placesOfPublication', 'cleanIsbn',
                            'cleanDoi', 'cleanIssn', 'containerStartPage', 'containerEndPage', 'publicationDates'
                        ];
                        return request;
                    }

                    scope.doSearch = function(more) {

                        if (!more) scope.resetResults();
                        scope.searchTimeout = false;
                        //dataset.articles[scope.currentArticle]._.reportToZenon = false; // @ TODO
                        if (!scope.search || !scope.search.term) return;
                        if (more) scope.page++;
                        console.log('Zenon search for term: ', scope.search);
                        //dataset.articles[scope.currentArticle].zenonId.value.value = ''; // @ TODO

                        $http(createRequestParams()).then(
                            response => {
                                console.log('success', response);
                                const data = response.data;
                                scope.results = scope.results.concat(data.records || []);
                                scope.found = parseInt(data.resultCount);
                                //scope.start = parseInt(data.responseHeader.params.start) + 10;
                                if (scope.found === 1) {
                                    scope.select(0);
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
                        scope.result = (scope.selected >= 0) ? scope.results[scope.selected] : null;
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

                    scope.lookUpInZenon = id => {window.open("https://zenon.dainst.org/Record/" + id)};

                    const smallLetters = "iIíìl|.:,;1-()'\"°^j ".split("");

                    scope.estimateWidth = content => ({minWidth: Math.min(25, content && content.split("/n")[0].split("")
                        .reduce((sum, char) => sum + ((smallLetters.indexOf(char) > 0) ? 0.1 : 0.9), 0)) + "em"});

                }
            }
        }
    ]);