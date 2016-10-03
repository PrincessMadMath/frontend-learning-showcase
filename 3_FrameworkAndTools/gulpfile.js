var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var cleanCSS = require('gulp-clean-css');
var del = require("del");
var runSequence = require("run-sequence");


// Before: compile lastest version of saas + setup browser-sync server
// Watch for update in .scss files and call sass compile if it is the case
gulp.task("watch", ["browser-sync", "sass-compile"], function() {
    gulp.watch("./app/scss/**/*.scss", ["sass-compile"]);
    gulp.watch("./app/scss/**/*.css", ["sass-compile"]);
    gulp.watch("./app/*.html", browserSync.reload);
});


gulp.task("build", function(callback) {
    runSequence('clean:dist', ['sass-compile', 'copy-html'], 'minify-css', callback)
    console.log('Building files');
});


// Browser-sunc will setup a server from the root we give it
gulp.task("browser-sync", function() {
    browserSync.init({
        server: {
            baseDir: "app"
        }
    });
});

// Compile the scss file and output in app/css
gulp.task("sass-compile", function() {
    return gulp.src("./app/scss/main.scss")
        .pipe(sass())
        .pipe(gulp.dest("./app/css"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify the css
gulp.task('minify-css', function() {
    return gulp.src("./app/css/*.css")
        .pipe(cleanCSS({
            debug: true
        }, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('./dist/css'));
})


gulp.task('clean:dist', function() {
    return del.sync('dist/*');
})

gulp.task('copy-html', function() {
    return gulp.src('./app/*.html')
        .pipe(gulp.dest('dist'));
});


gulp.task('lint-css', function() {
    const gulpStylelint = require('gulp-stylelint');

    return gulp.src('./app/scss/*.scss')
        .pipe(gulpStylelint({
            reporters: [{
                formatter: 'string',
                console: true
            }]
        }));

});
