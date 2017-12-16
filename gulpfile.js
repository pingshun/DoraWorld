var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var config = require('./config.js')

var paths = {
    js: ['./frontend/js/**/*.js', '!./frontend/js/dest/']
};

gulp.task('default', ['js:merge']);


gulp.task('js:merge', function() {
    gulp.src(['./frontend/js/**/*.js', '!frontend/js/dest/dw-all.js'])
        .pipe(concat('dw-all.js'))
        .pipe(config.is_dev ? gutil.noop() : uglify({mangle:true}))
        .pipe(gulp.dest('./frontend/js/dest/'))
});

gulp.task('watch', function() {
    gulp.watch(paths.js, ['js:merge']);
});
