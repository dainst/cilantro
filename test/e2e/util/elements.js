module.exports = {

    main: {
        mainMessage: element(by.css('#info-container .alert.main-message')),
    },
    login: {
        passwordInput: element(by.css('h1 input[type="password"]')),
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
    restart: {
        restartBtn: element(by.id('step-restart')),
        confirmRestartBtn: element(by.css('.btn-danger')),
    },
    publish: {
        proceedBtn: element(by.id('proceed')),
        uploadBtn: element.all(by.id('upload')),
        input: element.all(by.css('input.editable')),
        select: element.all(by.css('select.editable-select')),
        finalBtn: element(by.css('button[ng-click="uploadToOjs()"]')),
    },
    articles: {
        deleteArticleBtn: element(by.css('span[ng-click="removeArticle(article)"]')),
        addArticleBtn: element(by.css('button[ng-click="addArticle()"]')),
        articleView: element.all(by.css('tr[article="true"][class="ng-scope"]')),
        confirmBtn: element(by.css('.btn-success')),
        dismissBtn: element(by.css('.btn-danger')),
        displayColumn: element.all(by.css('button[ng-click="toggleList()"]')),
    },
    zenon: {
        markMissing: element(by.css('button[ng-click="markAsMissingZenon()"]')),
        reportMissing: element(by.css('button[ng-click="reportMissingToZenon()"]')),
        downloadLink: element(by.css('a.downloadLink')),
    },
    csv: {
        takeData: element(by.css('button[ng-click="parse()"]')),
        ignoreFirstRow: element(by.model('options.ignoreFirstRow')),
        confirm: element(by.css('button[ng-click="ok()"]')),
    },
    finish: {},
    overview: {}

};
