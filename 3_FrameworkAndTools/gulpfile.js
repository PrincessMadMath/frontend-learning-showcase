var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var cleanCSS = require('gulp-clean-css');
var del = require("del");

var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var reporter = require('postcss-reporter');

var syntax_scss = require('postcss-scss');
var stylelint = require('stylelint');

var sorting = require('postcss-sorting');


gulp.task('clean:dist', function(done) {
    return del(['dist/*'], done);
});

gulp.task("build", gulp.series('clean:dist', format, lint_css, gulp.parallel(process_css, process_html)));

// Before: compile lastest version of saas + setup browser-sync server
// Watch for update in .scss files and call sass compile if it is the case
gulp.task("watch", gulp.series(gulp.parallel(init_browser_sync, "build", watch)));

function watch() {

    var scss_watcher = gulp.watch("./app/scss/**/*.scss");
    scss_watcher.on("all", function(event, path, stats) {
        console.log('File ' + path + ' was ' + event + ', running tasks...');
        format();
        sync_css();
    });

    var html_watch = gulp.watch("./app/*.html", gulp.series(process_html, browserSync.reload));
};

gulp.task("watch:test", function() {
    var scss_watcher = gulp.watch("./app/scss/**/*.scss");

    console.log('Start watching...');
    scss_watcher.on("all", function(event, path, stats) {
        console.log('File ' + path + ' was ' + event + ', running tasks...');
        sync();
        console.log('task done....');
    });

});

gulp.task('lint-css', lint_css);
gulp.task('format', format);

function init_browser_sync() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
}

function sync_css() {
    return process_css()
        .pipe(browserSync.stream());
}



function process_html() {
    return gulp.src('./app/*.html')
        .pipe(gulp.dest('dist'));
}

function process_css() {

    var processors = [
        autoprefixer({
            browsers: ['last 2 versions']
        }),
        cssnano
    ];

    return gulp.src("./app/scss/main.scss")
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(gulp.dest("dist/css"));
}

function lint_css() {
    const gulpStylelint = require('gulp-stylelint');

    return gulp.src('./app/scss/*.scss')
        .pipe(gulpStylelint({
            reporters: [{
                formatter: 'string',
                console: true
            }]
        }));
}

function format() {
    var stylefmt = require('stylefmt');

    var processors = [
        sorting,
        stylefmt
    ];

    return gulp.src("./app/scss/main.scss")
        .pipe(postcss(processors, {
            syntax: syntax_scss
        }))
        .pipe(gulp.dest("./app/scss/"));
}
