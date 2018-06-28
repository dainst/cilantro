angular
.module("module.journal_issue", [])
.factory("journalIssue", ['editables', '$rootScope', 'settings', function(editables, $rootScope, settings) {

    let locales = ['de_DE', 'en_US', 'fr_FR', 'it_IT', 'es_ES'];
    /* locales list is part of journal, since some journals might be limited to some locale or
    might have extra ones */

    function MainObject() {
        return {
            "volume":                   editables.base(''),
            "year":                     editables.number(2018),
            "number":                   editables.base(''),
            "description":              editables.base('[PDFs teilweise verfügbar]', false),
            "importFilePath":           "",
            "identification":           editables.listitem(ojsIdentificationsCodes, 'vol_year', false),
            "ojs_journal_code":         editables.listitem(journalCodes, false, false).watch(journalCodeChangedObserver),
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
            'title':			editables.base(subObjectData.title, true),
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
            'zenonId':			editables.base(subObjectData.zenonId, false)
        };
    }

    function journalCodeChangedObserver() {
        /**
         * this gets triggered when a journal is chosen, since we hopefully know wich locales this journal supports,
         * we replace locales with the journal specific.
         * it has to be done like the following, not just replace the array, since we would have a new instance
         * and the integrity of the editables using locales would break!
         * @type {number}
         */
        locales.length = 0;
        dataset.getConstraint(dataset.data.ojs_journal_code.get(), 'locales').forEach(function(loc) {
            locales.push(loc);
        });
    }

    /**
     *  meta information
     *
     *  this is a set of information, wich can be set when we select the backend and get the info from there
     *  it should never be modified by protocol.
     *
     */
    let journalConstraints = {}; 	// information about available journals and their contraints
    let journalCodes = {};			// list of journals. must be a separate thing, otherwise time problem
    let getConstraint = function(journalCode, constraint) {
        if ((typeof journalConstraints[journalCode] !== "undefined") && (typeof journalConstraints[journalCode][constraint] !== "undefined")) {
            return journalConstraints[journalCode][constraint];
        }
    };
    function setConstraints(constraints) {
        journalConstraints = constraints;
        Object.keys(constraints).map(function(item){journalCodes[item] = item});
        console.log(journalCodes)
    }

    // @see https://github.com/pkp/ojs/blob/ojs-stable-2_4_8/plugins/importexport/native/NativeExportDom.inc.php#L32
    const ojsIdentificationsCodes = {
        'num_vol_year_title':'num_vol_year_title',
        'num_vol_year':'num_vol_year',
        'vol_year':'vol_year',
        'num_year_title':'num_year_title',
        'year':'year',
        'vol':'vol',
        'title':'title'
    };

    /**
     * object fields meta-data (such as labels etc.)
     * refactor plans :
     * looking for a more generic datamodel-model,
     * the defintions of the fields wich are in the cintructir now,
     * will be here as well..
     * for for now we divide fieldMeta and fields...
     */

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
            description: 'Order',
            style: {minWidth: '50px', maxWidth: '80px'}
        },
        author: {
            title: 'Author',
            style: {minWidth: '400px'},
            type: "metadata"
        },
        title: {
            title: 'Title',
            style: {minWidth: '400px'},
            type: "metadata"
        },
        pages: {
            title: 'Range of Pages',
            style: {minWidth: '170px'},
            type: "metadata"
        },
        abstract: {
            title: 'Abstract',
            style: {minWidth: '400px'},
            hide: true,
            type: "metadata"
        },
        date_published: {
            title: 'Date of Publishing',
            style: {minWidth: '150px'},
            hide: true,
            type: "metadata"
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
            hide: true
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
            type: "metadata"
        },
        language: {
            title: 'Language',
            hide: true,
            type: "metadata"
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