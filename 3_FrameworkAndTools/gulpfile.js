var gulp = require("gulp");
var sass = require("gulp-sass");


gulp.task("watch", ["sass:watch"]);


gulp.task("sass-compile", function() {
    return gulp.src("./css/main.scss")
        .pipe(sass())
        .pipe(gulp.dest("./css"));
});

gulp.task("sass:watch", function() {
    gulp.watch("./css/**/*.scss", ["sass-compile"]);
});
