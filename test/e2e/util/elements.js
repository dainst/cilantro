module.exports = {

    loader: element(by.css("#loader")),
    modal: element(by.css('.modal-dialog')),

    restart: {
        confirmBtn: element(by.css('.btn-danger')),
    },
    start: {
        startBtn: element(by.css('.row.toprow .btn-primary')),
    },
    documents: {
        treeViewItems: element.all(by.css('#staging-dir files-treeview > .tree-view > li')),
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
        columnsDropdownList: element.all(by.css('[elements="overviewColumns"] .dropdown-menu > li > label > input'))
    },
    article: {
        deleteBtn: element(by.css('span[ng-click="removeArticle(article)"]')),
        addBtn: element(by.css('button[ng-click="addArticle()"]')),
        entry: element.all(by.css('tr[article="true"][class="ng-scope"]')),
        confirmBtn: element(by.css('.btn-success')),
        dismissBtn: element(by.css('.btn-danger')),

    },
    csv: {
        takeData: element(by.css('button[ng-click="parse()"]')),
        ignoreFirstRow: element(by.model('options.ignoreFirstRow')),
        confirm: element(by.css('button[ng-click="ok()"]')),
        textField: element(by.id('raw_csv')),
        importTableColumns: element.all(by.css('#csv-import-table > thead > tr > td > select')),
        delimiterSelect: element(by.id('csv-import-delimiter')),
        authorDelimiter: element(by.id('csv-author-delimiter')),
        authorFormat: element(by.id('csv-author-format')),
        deviantColumnsWarning: element(by.id('csv-deviant-columns-warning')),
        delimiterWarning: element(by.id('csv-delimiter-warning')),
        moreOptions: element(by.id('csv-more-options'))
    },
    message: {
        main: element(by.css('#info-container .alert.main-message')),
    },
    publish: {
        proceedBtn: element(by.id('proceed')),
        uploadBtn: element.all(by.id('upload')),
        input: element.all(by.css('input.editable')),
        select: element.all(by.css('select.editable-select')),
        finalBtn: element(by.css('button[ng-click="uploadToOjs()"]')),
    },

    upload: {
        fileUploadArea: element(by.id('fileDropArea')),
        fileUploadBtn: element(by.id('uploadFileSelect')),
        fileElem: element(by.css('input[type="file"]')),
    },
    zenon: {
        markMissing: element(by.css('button[ng-click="markAsMissingZenon()"]')),
        reportMissing: element(by.css('button[ng-click="reportMissingToZenon()"]')),
        downloadLink: element(by.css('a.downloadLink')),
    },
    navbar: {
        overview: element(by.id('step-overview')),
        articles: element(by.id('step-articles')),
        restart: element(by.id('step-restart')),
        publish: element(by.id('step-publish')),
        toggle: element(by.css('.navbar-toggle'))
    },
    stats: {
        all: element.all(by.css('.stats .stat'))
    }

};
