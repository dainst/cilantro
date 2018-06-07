const gulp = require('gulp');
const modRewrite = require('connect-modrewrite');
const browserSync = require('browser-sync').create();

// runs the development server and sets up browser reloading
gulp.task('server', function() {

    //let config = require('./settings.json');

    browserSync.init({
        server: {
            baseDir: '.',
            middleware: [
                // rewrite for AngularJS HTML5 mode, redirect all non-file urls to index.html (copied from arache)
                modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.gif|\\.json|\\.woff2|\\.woff|\\.ttf$ /index.html [L]'])
            ]
        },
        port: 9082,
        notify: false
    });



    gulp.watch('style/**/*.css', ['watch-css']);
    gulp.watch('js/**/*.js', ['watch-js']);
    gulp.watch('partials/**/*.html', ['watch-js']);
    gulp.watch('index.html', ['watch-index']);
    gulp.watch('info/**/*', ['watch-info']);

});

gulp.task('server-e2e-test', function() {

    //let config = require('./settings.json');

    browserSync.init({
        server: {

            baseDir: '.',
            middleware: [
                // rewrite for AngularJS HTML5 mode, redirect all non-file urls to index.html (copied from arache)
                modRewrite(['settings.json$ settings.test.json [L]']),
                modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.gif|\\.json|\\.woff2|\\.woff|\\.ttf$ /index.html [L]'])
            ]
        },
        port: 9082,
        notify: false
    });




});
