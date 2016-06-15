var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;;
var modRewrite = require('connect-modrewrite');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var Server = require('karma').Server;

var pkg = require('./package.json');

var paths = {
	'build': 'dist/',
	'lib': 'bower_components/',
	'bootstrap': 'bower_components/bootstrap-sass/assets/'
};

// compile sass and concatenate to single css file in build dir
gulp.task('sass', function() {
	return gulp.src('src/scss/idai-components.scss')
	  	.pipe(sass({includePaths: [paths.bootstrap + 'stylesheets/'], precision: 8}))
	  	.pipe(concat(pkg.name + '.css'))
	    .pipe(gulp.dest(paths.build + '/css'))
	    .pipe(reload({ stream:true }));
});

// minify css files in build dir
gulp.task('minify-css', ['sass'], function() {
	return gulp.src(paths.build + '/css/*.css')
		.pipe(minifyCss())
  		.pipe(concat(pkg.name + '.min.css'))
		.pipe(gulp.dest(paths.build + '/css'));
});

// concatenates all js files in src into a single file in build dir
gulp.task('concat-js', function() {
	return gulp.src(['src/js/modules.js','src/js/**/*.js'])
		.pipe(concat(pkg.name + '-no-tpls.js'))
		.pipe(gulp.dest(paths.build))
    	.pipe(reload({ stream:true }));
});

// concatenates and minifies all dependecies into a single file in build dir
gulp.task('concat-deps', function() {
	return gulp.src([
			paths.lib + 'angular/angular.min.js',
			paths.lib + 'angular-bootstrap/ui-bootstrap-tpls.min.js',
			paths.lib + 'angular-route/angular-route.min.js',
			paths.lib + 'angular-animate/angular-animate.min.js'
		])
		.pipe(concat(pkg.name + '-deps.js'))
    	.pipe(uglify())
		.pipe(gulp.dest(paths.build));
});

// minifies and concatenates js files in build dir
gulp.task('minify-js', ['concat-js', 'html2js'], function() {
	return gulp.src([paths.build + '/' + pkg.name + '-no-tpls.js',
			paths.build + '/' + pkg.name + '-tpls.js'])
		.pipe(concat(pkg.name + '.js'))
    	.pipe(gulp.dest(paths.build))
    	.pipe(uglify())
		.pipe(concat(pkg.name + '.min.js'))
    	.pipe(gulp.dest(paths.build));
});

// converts, minifies and concatenates html partials
// in src to a single js file in build dir
gulp.task('html2js', function() {
	return gulp.src('src/partials/**/*.html')
		.pipe(minifyHtml())
		.pipe(ngHtml2Js({ moduleName: 'idai.templates', prefix: 'partials/' }))
		.pipe(concat(pkg.name + '-tpls.js'))
		.pipe(gulp.dest(paths.build));
});

gulp.task('copy-fonts', function() {
	return gulp.src(paths.bootstrap + '/fonts/**/*', { base: paths.bootstrap + '/fonts' })
  	.pipe(gulp.dest(paths.build + '/fonts'));
});

gulp.task('test', function (done) {
	new Server({
		configFile: __dirname + '/test/karma.conf.js',
		singleRun: true
	}, done).start();
});

gulp.task('build', [
	'sass',
	'minify-css',
	'concat-js',
	'concat-deps',
	'html2js',
	'minify-js',
	'copy-fonts'
]);

// clean
gulp.task('clean', function() {
	return del(paths.build + '/**/*');
});

// runs the development server and sets up browser reloading
gulp.task('server', ['sass', 'concat-js', 'html2js', 'copy-fonts'], function() {
	browserSync({
		server: {
			baseDir: '.',
        	middleware: [
        		// rewrite for AngularJS HTML5 mode, redirect all non-file urls to index.html
				modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.gif|\\.json|\\.woff2|\\.woff|\\.ttf$ /index.html [L]']),
        	]
		},
		port: 1235
	});

	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/js/**/*.js', ['concat-js']);
	gulp.watch('src/partials/**/*.html', ['html2js']);

	gulp.watch(['index.html',
		'partials/**/*.html',
		'src/partials/**/*.html',
		'js/**/*.js'], reload);
});

gulp.task('default', function() {
	runSequence('clean', 'test', 'build');
});