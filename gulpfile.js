'use strict';

var browserify = require('browserify');
var babelify = require('babelify');
var gulp = require('gulp');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var log = require('gulplog');
var shell = require('gulp-shell');
var aliasCombo = require('gulp-alias-combo');

gulp.task('dev', function() {
  return browserify({
        entries: './app/index.js',
        debug: true
    })
    // phantomjs的模块不要打包，因为默认这些包都只打给nodejs用的
    .external(['phantom'])
    .transform(babelify, {})
    .bundle()
    .pipe(source('./app/bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dev/'))
})

gulp.task('build', function() {
  return browserify({
        entries: './app/index.js',
        debug: false
    })
    // phantomjs的模块不要打包，因为默认这些包都只打给nodejs用的
    .external(['phantom'])
    .transform(babelify, {})
    .bundle()
    .pipe(source('./app/bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('watching', gulp.series('dev',function() {
    return watch('./app/**/*.js', gulp.series('dev'))
}))

gulp.task('shell:open', shell.task('npm run dev:multi'))
// gulp.task('shell:open', function() {
//     childProcess = child.execSync('npm run dev:multi')
// })
gulp.task('shell:down', function(){
    childProcess.kill()
})

gulp.task('default', gulp.series('watching'))
