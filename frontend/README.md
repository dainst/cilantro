# Salvia

see ../README.md

## setup w/o docker

- set up salvia
    - `npm install`
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


    