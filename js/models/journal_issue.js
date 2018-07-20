angular
.module("module.journal_issue", [])
.factory("journalIssue", ['editables', 'settings', function(editables, settings) {
    /*
     * refactor plans :
     * looking for a more generic datamodel-model,
     * the defintions of the fields wich are in the constructor now,
     * will be here as well..
     * for for now we divide fieldMeta and fields...
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
            "allow_upload_without_file":false
        }
    }

    function SubObject(subObjectData, mainObject, dataset) {
        subObjectData = subObjectData || {};
        mainObject = mainObject || {};
        dataset = dataset || {};
        return {
            'title':			new editables.Base(subObjectData.title, true),
            'abstract':			editables.text(subObjectData.abstract, false),
            'author':			editables.authorlist(subObjectData.author),
            'pages':			editables.page(subObjectData.pages),
            'date_published':	editables.date(subObjectData.date_published),
            'language':			editables.language('de_DE', false, locales),
            'auto_publish':		editables.checkbox(mainObject.default_publish_articles === true),
            'filepath':			editables.loadedfile(dataset.loadedFiles, false, mainObject.allow_upload_without_file),
            'attached':			editables.filelist(),
            'order':			editables.number(0, false),
            'create_frontpage':	editables.checkbox(mainObject.create_frontpage === true),
            'zenonId':			new editables.Base(subObjectData.zenonId, false)
        };
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


    let getConstraint = function(journalCode, constraint) {
        if ((typeof journalConstraints[journalCode] !== "undefined") && (typeof journalConstraints[journalCode][constraint] !== "undefined")) {
            return journalConstraints[journalCode][constraint];
        }
    };
    function setConstraints(constraints) {
        journalConstraints = constraints;
        Object.keys(constraints).forEach(item => {journalCodes[item] = item});
        console.log("Journals:", journalCodes);
    }





    /* object fields meta-data (such as labels etc.) */
    const mainObjectMeta = {
        "volume": {
            description: "Volume",
            type: "metadata"
        },
        "number": {
            description: "Number",
            type: "metadata"
        },
        "year": {
            description: "Year",
            type: "metadata"
        },
        "description": {
            description: "Description (e.g. '[PDFs teilweise verfügbar]')",
            type: "metadata"
        },
        "ojs_journal_code": {
            description: "OJS: Journal Code (e.g. 'chiron', 'aa', 'efb')",
            type: "metadata"
        },
        "ojs_user": {
            description: "OJS: user",
            type: "metadata"
        },
        "identification": {
            description: "OJS: issue identification",
            type: "metadata"
        },
        "importFilePath": {
            description: "File(s) to import",
            type: "metadata",
            hide: true,
        },
        "auto_publish_issue": {
            description: "Publish Issue after upload",
            type: "param"
        },
        "default_publish_articles": {
            description: "Publish Articles by default",
            type: "param"
        },
        "default_create_frontpage": {
            description: "Create Frontpage by default",
            type: "param"
        },
        "allow_upload_without_file": {
            description: "Upload without selected file is allowed?",
            type: "param"
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
            type: "metadata",
            sortByAllowed: true,
            mappings: {
                zenon: "authors"
            }
        },
        title: {
            title: 'Title',
            style: {minWidth: '400px'},
            type: "metadata",
            sortByAllowed: true,
            mappings: {
                zenon: "title"
            }
        },
        pages: {
            title: 'Range of Pages',
            style: {minWidth: '170px'},
            type: "metadata",
            thumbnailParam: "pages",
            sortByAllowed: true
        },
        abstract: {
            title: 'Abstract',
            style: {minWidth: '400px'},
            hide: true,
            type: "metadata",
            mappings: {
                zenon: "summary"
            }
        },
        date_published: {
            title: 'Date of Publishing',
            style: {minWidth: '150px'},
            hide: true,
            type: "metadata",
            mappings: {
                zenon: "publicationDates"
            }
        },
        auto_publish: {
            description: 'Automatically publish?',
            title: '#',
            style: {minWidth: '10px'},
            hide: true,
            type: "param"
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
            type: "param"
        },
        zenonId: {
            title: 'Zenon-Id',
            style: {minWidth: '150px'},
            hide: true,
            type: "metadata",
            mappings: {
                zenon: "id"
            }
        },
        language: {
            title: 'Language',
            hide: true,
            type: "metadata",
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