module.exports = {

    main: {
        passwordInput: element(by.css('h1 input[type="password"]')),
        mainMessage: element(by.css('#info-container .alert.main-message')),
        protocolSelect: element(by.model("protocols.current")),
        startBtn: element(by.css('.row.toprow .btn-primary')),
        restartBtn: element(by.css('#step-restart')),
        confirmRestartBtn: element(by.css('.btn-danger'))

    },
    articles: {},
    finish: {},
    overview: {}

};
