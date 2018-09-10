angular
.module("module.journalIssue", [])
.factory("journalIssue", ['editables', 'settings', function(editables, settings) {
    /*
     * refactor plans :
     * looking for a more generic datamodel-model,
     * the defintions of the fields which are in the constructor now,
     * will be here as well..
     * for for now we divide fieldMeta and fields...
     *
     * also convert MainOject and SubObject from factories into constructors
     */

    function MainObject(dataset) {
        return {
            "volume":                   new editables.Base(''),
            "year":                     editables.number(2018),
            "number":                   new editables.Base(''),
            "description":              new editables.Base('[PDFs teilweise verfügbar]', false),
            "importFilePath":           "",
            "identification":           editables.listitem(ojsIdentificationsCodes, 'vol_year', false),
            "ojs_journal_code":         editables.listitem(journalCodes, false, false)
                .watch(() => journalCodeObserver(dataset.data)),
            "ojs_user":                 "ojs_user",
            "auto_publish_issue":       editables.checkbox(false),
            "default_publish_articles": true,
            "default_create_frontpage": true,
            "allow_upload_without_file":false,
            "operations":               editables.multilistitem({NER: "NER", POS: "POS"}, ['POS'], false),
            "lang":                     "en",
            "do_ocr":                   editables.checkbox(false),
        }
    }

    function SubObject(subObjectData, mainObject, dataset) {
        subObjectData = subObjectData || {};
        mainObject = mainObject || {};
        dataset = dataset || {};
        const subObject = {
            'title':			new editables.Base(subObjectData.title, true),
            'abstract':			editables.text(subObjectData.abstract, false),
            'author':			editables.authorlist(subObjectData.author),
            'pages':			editables.page(subObjectData.pages),
            'date_published':	editables.date(subObjectData.date_published),
            'language':			editables.language(null, false, locales),
            'auto_publish':		editables.checkbox(mainObject.default_publish_articles === true),
            'filepath':			editables.loadedfile(dataset.loadedFiles, false, mainObject.allow_upload_without_file)
                .watch(() => loadedFileObserver(subObject)),
            'attached':			editables.filelist(),
            'order':			editables.number(0, false),
            'create_frontpage':	editables.checkbox(mainObject.default_create_frontpage === true),
            'zenonId':			new editables.Base(subObjectData.zenonId, false)
        };
        return subObject;
    }


    /* constraints */
    const locales = ['de_DE', 'en_US', 'fr_FR', 'it_IT', 'es_ES'];
    // some journals might be limited to some locales or might have extra ones
    let journalConstraints = {}; 	// information about available journals and their constraints
    let journalCodes = {};			// list of journals. must be a separate thing, otherwise time problem
    const ojsIdentificationsCodes = {
        'num_vol_year_title':'num_vol_year_title',
        'num_vol_year':'num_vol_year',
        'vol_year':'vol_year',
        'num_year_title':'num_year_title',
        'year':'year',
        'vol':'vol',
        'title':'title'
    };
    // @see https://github.com/pkp/ojs/blob/ojs-stable-2_4_8/plugins/importexport/native/NativeExportDom.inc.php#L32

    function journalCodeObserver(mainObject) {
        // this gets triggered when a journal is chosen
        locales.length = 0;
        const journalCode = mainObject.ojs_journal_code.get();
        if (journalCode && journalConstraints[journalCode])
            journalConstraints[journalCode].locales.forEach(loc => {locales.push(loc)});
    }

    function setConstraints(constraints) {
        journalConstraints = constraints;
        Object.keys(constraints).forEach(item => {journalCodes[item] = item});
        console.log("Journals:", journalCodes);
    }

    function loadedFileObserver(subObject) {
        if (angular.isDefined(subObject.filepath.list[subObject.filepath.get()]) &&
            angular.isDefined(subObject.filepath.list[subObject.filepath.get()].pagecontext)) {
            subObject.pages.context = subObject.filepath.list[subObject.filepath.get()].pagecontext;
            return;
        }
        subObject.pages.context = new editables.types.Pagecontext();
    }


    /* object fields meta-data (such as labels etc.) */
    const mainObjectMeta = {
        "volume": {
            title: "Volume",
            description: "Volume typically refers to the number of years the publication has been circulated",
            param: "metadata"
        },
        "number": {
            title: "Number",
            description: "refers to how many times that periodical has been published during that year",
            param: "metadata"
        },
        "year": {
            title: "Year",
            description: "Issue Year",
            param: "metadata"
        },
        "description": {
            title: "Description",
            description: "e.g. '[PDFs teilweise verfügbar]'",
            param: "metadata"
        },
        "ojs_journal_code": {
            title: "OJS: Journal Code",
            description:  "e. g. 'chiron', 'aa', 'efb'",
            param: "ojs_metadata"
        },
        "ojs_user": {
            title: "OJS: user",
            param: "ojs_metadata"
        },
        "identification": {
            title: "OJS: issue identification",
            param: "metadata"
        },
        "importFilePath": {
            title: "File(s) to import",
            param: "metadata",
            hide: true,
        },
        "auto_publish_issue": {
            title: "Publish Issue after upload",
            param: "ojs_metadata"
        },
        "default_publish_articles": {
            title: "Publish Articles by default",
            param: "ojs_metadata"
        },
        "default_create_frontpage": {
            title: "Create Frontpage by default",
            param: "ojs_metadata"
        },
        "allow_upload_without_file": {
            title: "Upload without selected file is allowed?",
            param: "ojs_metadata"
        },
        "operations" : {
            title: 'NLP operations',
            param: "nlp_params"
        },
        "lang" : {
            hide: true,
            param: "nlp_params"
        },
        "do_ocr": {
            title: "Perform OCR"
        }
    };

    const subObjectMeta = {
        order: {
            title: '#',
            description: 'Custom Order',
            style: {minWidth: '50px', maxWidth: '80px'},
            sortByAllowed: true
        },
        author: {
            title: 'Author',
            style: {minWidth: '400px'},
            param: "metadata",
            sortByAllowed: true,
            mappings: {
                zenon: "authors"
            }
        },
        title: {
            title: 'Title',
            style: {minWidth: '400px'},
            param: "metadata",
            sortByAllowed: true,
            mappings: {
                zenon: "title"
            }
        },
        pages: {
            title: 'Range of Pages',
            style: {minWidth: '170px'},
            param: "metadata",
            thumbnailParam: "pages",
            sortByAllowed: true,
            mappings: {
                zenon: "physicalDescriptions"
            }
        },
        abstract: {
            title: 'Abstract',
            style: {minWidth: '400px'},
            hide: true,
            param: "metadata",
            mappings: {
                zenon: "summary"
            }
        },
        date_published: {
            title: 'Date of Publishing',
            style: {minWidth: '150px'},
            hide: true,
            param: "metadata",
            mappings: {
                zenon: "publicationDates"
            }
        },
        auto_publish: {
            description: 'Automatically publish?',
            title: '#',
            style: {minWidth: '10px'},
            hide: true,
            param: true
        },
        filepath: {
            title: 'Loaded File',
            style: {minWidth: '150px'},
            hide: true,
            thumbnailParam: "filePath",
            sortByAllowed: true
        },
        attached: {
            title: 'Attached',
            description: 'Attached Files/Pages',
            style: {minWidth: '400px'},
            hide: true
        },
        create_frontpage: {
            description: 'Automatically create frontpage?',
            title: '#',
            style: {minWidth: '10px'},
            hide: true,
            param: true
        },
        zenonId: {
            title: 'Zenon-Id',
            style: {minWidth: '150px'},
            hide: true,
            param: "metadata",
            mappings: {
                zenon: "id"
            }
        },
        language: {
            title: 'Language',
            hide: true,
            param: "metadata",
            mappings: {
                zenon: "languages"
            }
        }
    };

    function getMeta(set) {
        if (set === "sub") {
            return subObjectMeta;
        }
        if (set === "main") {
            return mainObjectMeta;
        }
    }

    return {
        SubObjectPrototype: SubObject,
        MainObjectPrototype: MainObject,
        getMeta: getMeta,
        setConstraints: setConstraints
    }

}]);