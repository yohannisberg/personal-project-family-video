var gulp = require('gulp')
  , sass = require('gulp-sass')
  , sourcemaps = require('gulp-sourcemaps')
  , CacheBuster = require('gulp-cachebust')
  , concat = require('gulp-concat')
  , cachebust = new CacheBuster()
  , print = require('gulp-print')
  , babel = require('gulp-babel');

gulp.task('build-css', () => {
  return gulp.src('./public/styles/**/*')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(cachebust.resources())
  .pipe(concat('styles.css'))
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('./dist'))
});

gulp.task('build-js', function() {
   return gulp.src('./public/js/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(print())
      .pipe(babel({ presets: ['es2015'] }))
      .pipe(concat('bundle.js'))
      //.pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/js'));
});

gulp.task('build-pictures', function(){
  return gulp.src('./public/pictures/**/*')
    .pipe(gulp.dest('./dist/pictures'))
});

gulp.task('build-views', function(){
  return gulp.src('./public/views/**/*.html')
  .pipe(gulp.dest('./dist/views'))
});

gulp.task('build', [ 'build-css', 'build-js', 'build-pictures', 'build-views'], function() {
    return gulp.src('./public/index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    return gulp.watch(['./public/index.html', './public/styles/**/*', './public/js/**/*.js', './public/pictures/**/*', './public/views/**/*.html'], ['build']);
});
