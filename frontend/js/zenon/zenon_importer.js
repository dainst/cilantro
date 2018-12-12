angular

    .module('module.zenonImporter', [])

    .factory('zenonImporter', ['$sce', '$http', 'dataset', 'editables', 'settings', 'messenger',
        function($sce, $http, dataset, editables, settings, messenger) {

            const zenonEndpoint = $sce.trustAsResourceUrl(settings.zenon_url);

            const zenonImporter = {};

            function createRequestParams(term, id, page) {
                const isId = term => !!term.match(/^\w?\w?\d{9}$/);
                const request = {};
                request.method = 'GET';
                request.params = {};

                if (!id && !isId(term)) {
                    request.url = zenonEndpoint + 'search';
                    request.params.lookfor = term;
                    request.params.page = page;
                    request.params.limit = 10;
                    request.params.type = "Title";
                    request.params.sort = "relevence";
                } else {
                    console.log("zenon search for id ", id, term);
                    request.url = zenonEndpoint + 'record';
                    request.params.id = id || term
                }
                request.params["field[]"] = ['id', 'title', 'authors', 'summary', 'formats', 'series',
                    'languages', 'urls', 'subjects', 'physicalDescriptions', 'placesOfPublication', 'cleanIsbn',
                    'cleanDoi', 'cleanIssn', 'containerStartPage', 'containerEndPage', 'publicationDates'
                ];
                return request;
            }

            zenonImporter.get = (term, id, page) => new Promise((resolve, reject) => {
                $http(createRequestParams(term, id, page)).then(
                    response => {
                        console.log('success', response);
                        resolve(response.data);
                    },
                    err => {
                        console.error(err);
                        messenger.error('No Result from Zenon!');
                        reject(err);
                    }
                );
            });

            /**
             * This converts the raw Zenon-Dataset to a set of editables. Thus the zenon.js-widget does not
             * have to know anything about editables (and could be moved to iDai.compontens once) and the rest of this
             * app does not have to know anything about zenon record structures. The set of editables can be handled by
             * dataset to create or modify subobjects/articles.
             */
            zenonImporter.convert = zenonRecord => {
                const setOfEditables = {};
                Object.keys(zenonRecord).forEach(rowName => {
                    const rowValue = zenonRecord[rowName];
                    //console.log("XXX", rowName, rowValue);
                    switch (rowName) {
                        case "title":
                            setOfEditables[rowName] = new editables.Base(rowValue);
                            break;
                        case "authors":
                            setOfEditables[rowName] = editables.authorlist();
                            setOfEditables[rowName].setAuthors(
                                Object.keys(rowValue.primary || [])
                                .concat(Object.keys(rowValue.secondary || []))
                                .concat(Object.keys(rowValue.corporate || []))
                            , 1);
                            break;
                        case "summary":
                            setOfEditables[rowName] = editables.text(rowValue);
                            break;
                        case "id":
                            setOfEditables[rowName] = new editables.Base(rowValue);
                            break;
                        case "languages":
                            setOfEditables[rowName] = editables.language(rowValue[0]);
                            break;
                        case "publicationDates":
                            setOfEditables[rowName] = editables.date(rowValue[0]);
                            break;
                        case "physicalDescriptions":
                            setOfEditables[rowName] = editables.page(rowValue[0] || "");
                            break;
                    }

                });
                return setOfEditables;
            };


            return zenonImporter;

        }
    ]);