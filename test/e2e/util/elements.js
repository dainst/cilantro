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
        confirmBtn: element(by.css('.btn-success')),
        uploadBtn: element(by.id('upload')),
        input: element.all((by.css('input.editable'))),
        select: element.all((by.css('select.editable-select'))),
        finalBtn: element(by.css('button[ng-click="uploadToOjs()"]')),
    },
    edit: {
        deleteArticleBtn: element(by.css('span[ng-click="removeArticle(article)"]')),
        addArticleBtn: element(by.css('button[ng-click="addArticle()"]')),
        articleView: element.all(by.css('input.ng-not-empty')).first(),
    },
    zenon: {
        markMissing: element(by.css('button[ng-click="markAsMissingZenon()"]')),
        reportMissing: element(by.css('button[ng-click="reportMissingToZenon()"]')),
        downloadLink: element(by.css('a.downloadLink')),
    },
    articles: {},
    finish: {},
    overview: {}

};
