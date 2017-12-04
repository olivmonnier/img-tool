const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('clean', () => {
  return del('./dist');
});

gulp.task('htmlminify', () => {
  return gulp
    .src("src/*.html")
    .pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        removeEmptyAttributes: true
      }))
    .pipe(gulp.dest("dist"));
});

gulp.task('default', function() {
  return runSequence('clean', 'htmlminify')
});