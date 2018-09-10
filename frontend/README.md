# ojs-importer
The future Cilantro-Frontend

## installation

### a) Run without backend
- set up salvia
    - `npm install`
    - `mv config/settings.test.json config/settings.json`
    - `npm run e2e-mock-backend`
    - (new Tab)
    - `npm run server`

### b) Run with local Cilantro
- get cilantro
    - Clone https://github.com/dainst/cilantro
    - follow cilantro install instructions
    - `docker-compose up`
   
- set up salvia
    - go to salvia-dir
    - `npm install --dev`
    - `mv config/settings.local_cilantro.json config/settings.json`
    - `npm run server`

### c) Run with user defined configuration
- set up salvia
    - `npm install`
    - `mv config/settings.default.json config/settings.json`
    - `nano config/settings.json`:
    ```
    {
      "files_url":    "http:// ##cilantro## / ##staging_folder##",
      "server_url":   "http:// ##cilantro##",
      "ojs_url":      "http:// ##ojs2 installation## /plugins/generic/ojs-cilantro-plugin/api/",
      "zenon_url":    "https://zenon.dainst.org/api/v1/",
      "importer_url": "http://localhost:9082",
      "server_user":  "##cilantro user##",
      "server_pass":  "##cilantro password##"
    }
    ```
     - `npm run server`

## build
There is no build process right now.

## test
- `npm run e2e`
    - or (recommended) in 3 different tabs
        - `npm run e2e-mock-backend`
        - `mv config/settings.test.json config/settings.json`
        - `npm run server
        - `npm run e2e-test`
- unit tests are missing 

### tips

- change promisesDelay-attribute in  test/e2e/protractor.conf to slow tests down if you wanna watch them (eg to 150)


## code style

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
    