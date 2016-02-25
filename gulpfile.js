var
gulp            = require('gulp'),
sass            = require('gulp-sass'),
shell           = require('gulp-shell'),
data            = require('gulp-data'),
nunjucksRender  = require('gulp-nunjucks-render'),
browserSync     = require('browser-sync'),
file            = require('gulp-file'),
plumber         = require('gulp-plumber'),
packagejson     = require('./package.json');

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'public' // This is the DIST folder browsersync will serve
    },
    open: false
  })
})

gulp.task('sass', function() {
  return gulp.src('source/sass/styles.scss')  // sass entry point
  .pipe(plumber())
  .pipe(sass())
  .pipe(gulp.dest('public/css'))
  .pipe(browserSync.stream());
});

gulp.task('img', function() {
  return gulp.src('source/img/**/*')
  .pipe(plumber())
  .pipe(gulp.dest('public/img'))
  .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src('node_modules/govlab-styleguide/js/**/*')
  .pipe(plumber())
  .pipe(gulp.dest('public/js'))
  .pipe(browserSync.stream());
});

// Nunjucks
gulp.task('nunjucks', function() {

  var options = {
    path: 'source/templates',
    ext: '.html'
  };
  // nunjucksRender.nunjucks.configure(['source/templates/']);

  return gulp.src('source/templates/**/*.+(html|nunjucks)')
  .pipe(plumber())
  // Adding data to Nunjucks
  .pipe(data(function() {
    return require('./source/data/data.json')
  }))
  .pipe(nunjucksRender(options))
  .pipe(gulp.dest('public'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('default', ['browserSync', 'sass', 'nunjucks', 'js', 'img'], function (){
  gulp.watch('source/sass/**/*.scss', ['sass']);
  gulp.watch('source/templates/**/*.html', ['nunjucks']);
  gulp.watch('source/img/**/*', ['img']);
});