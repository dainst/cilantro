# Salvia

see ../README.md

## Prerequisites
- nodejs 9+
## setup w/o docker

- have a current version of firefox (newer then esr52)

- set up salvia
    - `npm install`
    - `node_modules/webdriver-manager/bin/webdriver-manager update`
    - `mv config/settings.test.json config/settings.json`
    - `npm run e2e-mock-backend`
    - (new Tab)
    - `npm run server`


Testing:

- `npm run e2e`
    - or (recommended) in 3 different tabs
        - `npm run e2e-mock-backend`
        - `mv config/settings.test.json config/settings.json`
        - `npm run server
        - `npm run e2e-test`
- unit tests are missing 


    
