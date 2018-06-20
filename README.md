# ojs-importer
The future Cilantro-Frontend

# installation

## a) without backend
- `npm install`
- `mv settings.test.json settings.json`
- `npm run server`

## b) with cilantro as backend
COMING SOON

## c) with old PHP-Backend and Apache (lagacy-branch)
- clone to /var/www/importer or similar
- configure apache to serve /var/www
- npm install
- create folders:
    - tmp 
    - reports
    - staging
- create settings.php like settings.default.php and fill out
- create settings.json like settings.default.json and fill out
- http://localhost/importer



We use a the mock-backend here which was created für the npm tests and serve the app with gulp.

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
    - for members of datamodel (journal, article): under_score
    - private functions with _ prefix
    - in css: snake-case 
    - filenames snake-case myController in my-controller.js
- ES6
    - `let/const` instead of `var` where it makes sense: http://es6-features.org/#BlockScopedVariables
- more    
    - `===` instead of `==`
    - line endings with `;` even after `}` 
    