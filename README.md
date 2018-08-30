# ojs-importer
The future Cilantro-Frontend

# installation

## a) without backend
- `npm install`
- `mv config/settings.test.json config/settings.json`
- `npm run e2e-mock-backend`
- (new Tab)
- `npm run server`

## b) example configuration with local cilantro as backend and local ojs2 with docker
- get cilantro
    - Clone https://github.com/dainst/cilantro
    - follow cilantro install instructions
    - `docker-compose up`
   
- set up salvia
    - go to salvia-dir
    - `npm install`
    - `mv config/settings.cilantro_local.json config/settings.json`
    - `npm run server`

## c) with old PHP-Backend and Apache (legacy-branch)
- clone to /var/www/importer or similar
- configure apache to serve /var/www
- npm install
- create folders:
    - tmp 
    - reports
    - staging
- create settings.php like config/settings.default.php and fill out
- create settings.json like config/settings.default.json and fill out
- http://localhost/importer


# build
There is no build process right now.

# test
- `npm run e2e`
    - or in 3 tabs
        - `npm run e2e-mock-backend`
        - `npm run server`
        - `npm run e2e-test`
- unit tests are missing 

# code style

- indentation: 4 Spaces instead of tab
    - idea: settings->editor->javascript
    - atom: settings->editor
- names
    - for js-variables: camelCase 
    - for members of datamodel (dataset, article): under_score
    - in css: snake-case 
    - filenames and module names: under_score, eg: myController in my_controller.js
- ES6
    - `let/const` instead of `var` where it makes sense: http://es6-features.org/#BlockScopedVariables
    - arrow function when ever function is not local and [this]-scope is not needed
- more    
    - `===` instead of `==`
    - line endings with `;` even after `}` 
    