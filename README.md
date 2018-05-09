# ojs-importer
The future Cilantro-Frontend

# installation

## a) with old PHP-Backend and Apache
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

## b) without backend
- npm install
- mv settings.test.json settings.json
- npm run server

We use a the mock-backend here which was created für the npm tests and serve the app with gulp.

# build
There is no build process right now.

# test
- npm run e2e
- unit tests are missing 