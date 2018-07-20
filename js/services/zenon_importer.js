/**
 * This service has 1 job. It converts the raw Zenon-Dataset to a set of editables. Thus the zenon.js-widget does not
 * have to know anything about editables (and could be moved to iDai.compontens once) and the rest of this app does not
 * have to know anything about zenon record structures. The set of editables can be handled by dataset to create or modify
 * subobjects/articles.
 */

angular

    .module('module.zenon_importer', [])

    .factory('zenon_importer', ['dataset', 'editables',
        function(dataset, editables) {

            const zenonImporter = {};

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