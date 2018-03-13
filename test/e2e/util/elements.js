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
    restart: {
        restartBtn: element(by.css('#step-restart')),
        confirmRestartBtn: element(by.css('.btn-danger')),
    },
    publish: {
        proceedBtn: element(by.css('#proceed')),
        confirmBtn: element(by.css('.btn-success')),
        uploadBtn: element(by.css('#upload')),
    },

    articles: {},
    finish: {},
    overview: {}

};
