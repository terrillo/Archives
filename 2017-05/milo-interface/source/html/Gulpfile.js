'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var jsFiles = 'src/scripts/**/*.js',
    jsDest = 'dist/scripts';

gulp.task('scripts', function() {
  return gulp.src(jsFiles)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(jsDest));
});

gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('default', function () {
  gulp.watch('./src/sass/**/*.sass', ['sass']);
  gulp.watch('./src/scripts/**/*.js', ['scripts']);
});
