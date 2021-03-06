/*
 * @Author: Rongxis 
 * @Date: 2019-08-17 11:00:02 
 * @Last Modified by:   Rongxis 
 * @Last Modified time: 2019-08-17 11:00:02 
 */

'use strict';
var browserify = require('browserify')
var babelify = require('babelify')
var gulp = require('gulp')
var watch = require('gulp-watch')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var uglify = require('gulp-uglify')
var globby = require('globby')
var sourcemaps = require('gulp-sourcemaps')
var log = require('gulplog')
var shell = require('gulp-shell')
var alias = require('./gulp-alias')
var through = require('through2')
var path = require('path')
var _package = require('./package.json')
var pathConfig = {
    alias: _package.alias,
    dest: 'temp_dest',
    root: 'src'
}

gulp.task('query:path', function() {
    return gulp.src(pathConfig.root + '/**/*.*').pipe(alias(pathConfig)).pipe(gulp.dest(path.resolve(pathConfig.dest, pathConfig.root)))
})

gulp.task('dev', gulp.series('query:path',function() {
  return browserify({
        entries: path.resolve(pathConfig.dest, pathConfig.root, 'app/index.js'),
        debug: true
    })
    // phantomjs的模块不要打包，否则无法运行
    .external(['phantom','fs','child_process'])
    .transform(babelify, {})
    .bundle()
    .pipe(source('./bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dev/'))
}))

gulp.task('build', gulp.series('query:path', function() {
  return browserify({
        entries: path.resolve(pathConfig.dest, pathConfig.root, 'app/index.js'),
        debug: false
    })
    // phantomjs的模块不要打包，否则无法运行
    .external(['phantom','fs','child_process'])
    .transform(babelify, {})
    .bundle()
    .pipe(source('./bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    // .pipe(uglify())
    // .on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'))
}))

gulp.task('watching', gulp.series('dev',function() {
    return watch(pathConfig.root + '/**/*.js', gulp.series('dev'))
}))

gulp.task('shell:open', shell.task('npm run dev:multi'))
// gulp.task('shell:open', function() {
//     childProcess = child.execSync('npm run dev:multi')
// })
gulp.task('shell:down', function(){
    childProcess.kill()
})


gulp.task('default', gulp.series('watching'))
