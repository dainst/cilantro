const gulp = require('gulp');
const modRewrite = require('connect-modrewrite');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const fs = require('fs');
const argv = require('yargs').argv;

// runs the development server and sets up browser reloading
gulp.task('server', () => {

    const settingsFileName = (typeof argv.settings !== "undefined") ?  '.' + argv.settings : '';
    const settingsFilePath = "config/settings" + settingsFileName + ".json";
    const syncBrowser = (typeof argv.sync === "undefined") || (argv.sync !== "false");

    if (!fs.existsSync(settingsFilePath)) {
        console.log("ERROR: Settings-file '" + settingsFilePath + "' not found.");
        process.exit();
    }

    console.log("Starting Salvia with settings-file '" + settingsFilePath + "'");

    const middleware = [
        // rewrite for AngularJS HTML5 mode, redirect all non-file urls to index.html (copied from arachne)
        modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.gif|\\.json|\\.woff2|\\.woff|\\.ttf|\\.ico|\\.json$ /index.html [L]'])
    ];

    if (settingsFileName !== '') middleware.push(modRewrite(['config/settings.json$ ' + settingsFilePath + ' [L]']),);

    browserSync.init({
        server: {
            baseDir: '.',
            middleware: middleware
        },
        port: 9082,
        notify: false
    });

    if (syncBrowser) {
        console.log("Sync browser mode is on");
        gulp.watch('style/**/*.css', ['watch']);
        gulp.watch('js/**/*.js', ['watch']);
        gulp.watch('partials/**/*.html', ['watch']);
        gulp.watch('index.html', ['watch']);
        gulp.watch('config/*.json', ['watch']);
        gulp.watch('style/*.css', ['watch']);
    }

});

gulp.task('watch', function(done) { reload(); done(); });