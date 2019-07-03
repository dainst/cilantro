module.exports = {

    loader: element(by.css("#loader")),
    modal: element(by.css('.modal-dialog')),

    restart: {
        confirmBtn: element(by.css('.btn-danger')),
    },
    home: {
        startBtn: element(by.css('.row.toprow .btn-primary')),
        importJournal: element(by.id('import-journal-link'))
    },
    mainobject: {
        table: element(by.css('.dataset-table')),
        tableRows: element.all(by.css('.dataset-table tr')),
    },
    documents: {
        treeViewItems: element.all(by.css('#staging-dir files-treeview > .tree-view > li')),
        treeViewItemsNames: element.all(by.css('#staging-dir > files-treeview > .tree-view > li > span > .branch')),
        treeViewItemsTopLevel: element.all(by.css('#staging-dir > files-treeview > .tree-view > li')),
        toggleBranchBtn: element(by.css('#staging-dir > files-treeview .toggle')),
        proceedBtn: element(by.css('#proceed')),
        fileHandlerArea: element(by.css('#file-handler-selection'))
    },
    overview: {
        table: element(by.css('.super-table')),
        tableHeadColumns: element.all(by.css('.super-table > thead > tr > td')),
        tableRows: element.all(by.css('.super-table > tbody > tr')),
        displayColumn: element.all(by.css('button[ng-click="toggleList()"]')),
        addBtn: element(by.css('button[ng-click="addArticle()"]')),
        columnsDropdown: element(by.css('[elements="overviewColumns"]')),
        columnsDropdownBtn: element(by.css('[elements="overviewColumns"] > span > button')),
        columnsDropdownList: element.all(by.css('[elements="overviewColumns"] .dropdown-menu > li > label > input')),
        sortByBtn: element(by.id('sort-by-toggle')),
        sortByDropdown: element(by.id('sort-by-dropdown')),
        proceedBtn: element(by.css('#proceed')),
    },
    subobject: {
        add: element(by.css('#subobjects-new')),
        select: element.all(by.css('#subobjects-select ul li a')),
        trash: element.all(by.css('#subobjects-trash ul li a')),
        selectBtn: element.all(by.css('#subobjects-select button')),
        trashBtn: element.all(by.css('#subobjects-trash button')),
        confirmBtn: element(by.css('.btn-success')),
        dismissBtn: element(by.css('.btn-danger')),
        table: element(by.css('.article-table')),
        tableRows: element.all(by.css('.article-table tr')),
    },
    attachedList:{
        moveUp: element.all(by.css(".flMoveUp")),
        moveDown: element.all(by.css(".flMoveDown")),
        detach: element.all(by.css(".flDetach")),
        tables: element.all(by.css(".flTable")),
        cells: element.all(by.css(".flName"))
    },
    csv: {
        takeData: element(by.css('button[ng-click="parse()"]')),
        ignoreFirstRow: element(by.model('options.ignoreFirstRow')),
        confirm: element(by.css('button[ng-click="ok()"]')),
        undelete: element(by.css('button[ng-click="undeleteArticle()"')),
        textField: element(by.id('raw_csv')),
        importTableColumns: element.all(by.css('#csv-import-table > thead > tr > td > select')),
        delimiterSelect: element(by.id('csv-import-delimiter')),
        authorDelimiter: element(by.id('csv-author-delimiter')),
        authorFormat: element(by.id('csv-author-format')),
        deviantColumnsWarning: element(by.id('csv-deviant-columns-warning')),
        delimiterWarning: element(by.id('csv-delimiter-warning')),
        moreOptions: element(by.id('csv-more-options')),
        autoFetchFromZenon: element(by.id('csv-autofetch')),
    },
    message: {
        container: element(by.css('#info-container')),
        main: element(by.css('#info-container .alert.main-message')),
        clear: element(by.css('#info-container a')),
    },
    publish: {
        proceedBtn: element(by.id('proceed')),
        uploadBtn: element(by.css('#run-job')),
        input: element.all(by.css('input.editable')),
        select: element.all(by.css('select.editable-select')),
    },

    upload: {
        fileUploadArea: element(by.id('upload-area')),
        fileUploadBtn: element(by.id('uploadFileSelect')),
        fileElem: element(by.css('input[type="file"]')),

        progressbar: element(by.css('#upload-area .progressbar'))
    },
    zenon: {
        markMissing: element(by.css('button[ng-click="markAsMissingZenon()"]')),
        adopt: element(by.css('button[ng-click="adoptFromZenon()"]')),
        newArticle: element(by.css('button[ng-click="newFromZenon()"]')),
        searchBox: element(by.css('#zenon-search')),
        submit: element(by.css('#zenon-submit')),
        resultCount: element(by.css('#zenon-result-count')),
        resultRows: element.all(by.css('#zenon-results table tbody tr')),
        loadMore: element(by.css('#zenon-load-more')),
    },
    navbar: {
        start: element(by.id('step-start')),
        subobjects: element(by.id('step-subobjects')),
        publish: element(by.id('step-finish')),
        loginBtn: element(by.id('loginbutton')),
        loggedInDropdown: element(by.css('.ng-scope dropdown'))
    },
    loginModal: {
        username: element(by.id('input-username')),
        password: element(by.id('input-password')),
        errorMessage: element(by.id('login-error')),
        login: element(by.id('submit-login')),

    },
    stats: {
        all: element.all(by.css('.stats .stat'))
    }

};
