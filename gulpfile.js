var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  browserify = require('gulp-browserify'),
  browserSync = require('browser-sync'),
  jshint = require('gulp-jshint'),
  jshintStyle = require('jshint-stylish'),
  minifyCSS = require('gulp-minify-css'),
  notify = require('gulp-notify'),
  path = require('path'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: path.join(__dirname, 'build')
    },
    host: 'localhost',
    port: 1337,
    open: false
  });
});

gulp.task('html', function(){
  gulp.src(path.join(__dirname, 'views/**/*.html'))
    .pipe(gulp.dest(path.join(__dirname, 'build')))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(sass())
    .pipe(
      // @TODO (@bitfyre) Make this configureable.
      autoprefixer('last 2 version', '> 1%', 'ie 8', 'ie 9')
    )
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/css/'))
    .pipe(notify({ message: 'CSS complete' }));
});

gulp.task('jshint', function() {
  return gulp.src('./js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStyle))
    .pipe(jshint.reporter('fail'))
    .pipe(notify({ message: 'JSHint complete' }));
});

gulp.task('scripts', function() {
  gulp.src('js/fizzion.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    .pipe(gulp.dest('./build/js/'))
    .pipe(uglify())
    .pipe(rename({
	     extname: '.min.js'
	   }))
    .pipe(replace('./build/js/*.min.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(notify({ message: 'JS files complete' }));
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['jshint', 'scripts']);
  gulp.watch('views/**/*.html', ['html']);
});

gulp.task('default', ['watch']);
