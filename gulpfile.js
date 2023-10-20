const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const uglify = require('gulp-uglify-es').default;
const csso = require('gulp-csso');
const rename = require('gulp-rename');

const directories = {
  scss: 'assets/scss/',
  js: 'assets/js/'
};

// All files.
const cssAllFiles = directories.scss+'**/*.scss';
const jsAllFiles = directories.js+'**/*.js';

// Global theme files.
const cssSrcFiles = [
  directories.scss+'main.scss',
  directories.scss+'vendors/jquery.litbox.scss'
];
const jsSrcFiles = [
  directories.js+'help.js',
  directories.js+'language.js',
  directories.js+'user.js',
  directories.js+'main.js',
  directories.js+'forms.js',
  directories.js+'vendors/jquery.litbox.js',
  directories.js+'vendors/jquery.bouncer.polyfills.js'
];

const cssDestination = 'dist/css';
const jsDestination = 'dist/js';


// Task to process and concatenate CSS files
gulp.task('css', function() {
  return gulp.src(cssAllFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(cssDestination));
});

// Task to process and concatenate CSS files
gulp.task('css-concat', function() {
  return gulp.src(cssSrcFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(concat('theme.min.css'))
    .pipe(gulp.dest(cssDestination));
});


// Task to process and concatenate JS files
gulp.task('js', function() {
  return gulp.src(jsAllFiles)
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(jsDestination));
});
// Task to process and concatenate JS files
gulp.task('js-concat', function() {
  return gulp.src(jsSrcFiles)
    .pipe(uglify())
    .pipe(concat('theme.min.js'))
    .pipe(gulp.dest(jsDestination));
});


// Task to watch for changes in CSS and JS files
gulp.task('watch', function() {
  gulp.watch([cssAllFiles], gulp.series('css'));
  gulp.watch([jsAllFiles], gulp.series('js'));

  gulp.watch([cssAllFiles], gulp.series('css-concat'));
  gulp.watch([jsAllFiles], gulp.series('js-concat'));
});

// Default task
gulp.task('default', gulp.parallel('css', 'js', 'css-concat', 'js-concat', 'watch'));


