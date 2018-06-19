module.exports = {

    loader: element(by.css("#loader")),

    article: {
        deleteBtn: element(by.css('span[ng-click="removeArticle(article)"]')),
        addBtn: element(by.css('button[ng-click="addArticle()"]')),
        entry: element.all(by.css('tr[article="true"][class="ng-scope"]')),
        confirmBtn: element(by.css('.btn-success')),
        dismissBtn: element(by.css('.btn-danger')),
        displayColumn: element.all(by.css('button[ng-click="toggleList()"]')),
    },
    csv: {
        takeData: element(by.css('button[ng-click="parse()"]')),
        ignoreFirstRow: element(by.model('options.ignoreFirstRow')),
        confirm: element(by.css('button[ng-click="ok()"]')),
    },
    login: {
        passwordInput: element(by.css('h1 input[type="password"]')),
        submitPassword: element(by.id('submit')),
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
    restart: {
        confirmBtn: element(by.css('.btn-danger')),
    },
    start: {
        protocolSelect: element(by.model("protocols.current")),
        fileSelect: element(by.model('journal.data.importFilePath')),
        startBtn: element(by.css('.row.toprow .btn-primary')),
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
    }

};
