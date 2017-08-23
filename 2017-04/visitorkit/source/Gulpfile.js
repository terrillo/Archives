var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('build', function () {
  return browserify({entries: './src/app.jsx', extensions: ['.jsx'], debug: true})
    .transform('babelify',{ presets: ['es2015', 'react'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('scss', function () {
  return gulp.src('./src/**/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['build'], function () {
  gulp.watch('./src/**/*.jsx', ['build']);
  gulp.watch('./src/**/*.scss', ['scss']);
});

gulp.task('default', ['watch']);
