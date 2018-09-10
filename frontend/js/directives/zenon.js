angular
    .module('directive.zenon', [])
    .directive("zenon", ['$timeout', '$rootScope', 'zenonImporter',
        function($timeout, $rootScope, zenonImporter) {
            return {
                restrict: 'E',
                templateUrl: 'partials/elements/zenon.html',
                scope: {
                    search: '<', // {term: "", id: ""}
                    result: '='
                },
                link: function (scope, element, attrs) {

                    scope.results = [];
                    scope.selected = -1;
                    scope.found = 0;
                    scope.page = 0;
                    scope.searchTimeout = false;

                    scope.$watchCollection("search", (newValue, oldValue, scope) => {
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


                    scope.doSearch = function(more) {

                        if (!more) scope.resetResults();
                        scope.searchTimeout = false;
                        if (!scope.search || !scope.search.term) return;
                        if (more) scope.page++;
                        console.log('Zenon search for term: ', scope.search);

                        zenonImporter.get(scope.search.term, scope.search.id, scope.page).then(
                            data => {
                                scope.results = scope.results.concat(data.records || []);
                                scope.found = parseInt(data.resultCount);
                                if (scope.found === 1) {
                                    scope.select(0);
                                }
                                $rootScope.$broadcast('refreshView');
                            },
                            err => {
                                scope.resetResults();
                                $rootScope.$broadcast('refreshView');
                            }
                        );


                    };

                    scope.select = index => {
                        scope.selected = (scope.selected === index) ? -1 : index;
                        scope.result = (scope.selected >= 0) ? scope.results[scope.selected] : null;
                    };

                    scope.displayRecord = record => ({
                        Id: record.id,
                        Title: record.title,
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
                        ISBN: record.cleanIsbn,
                        Year: record.publicationDates && record.publicationDates.join("; ")
                    });

                    scope.lookUpInZenon = id => {window.open("https://zenon.dainst.org/Record/" + id)};

                    const smallLetters = "iIíìl|.:,;1-()'\"°^j !".split("");

                    scope.estimateWidth = content => ({minWidth: Math.min(25, content && content.split("/n")[0].split("")
                        .reduce((sum, char) => sum + ((smallLetters.indexOf(char) > 0) ? 0.1 : 0.9), 0)) + "em"});

                }
            }
        }
    ]);