'use strict';

const gulp = require('gulp');
const sequence = require('gulp-sequence');
const copy = require('gulp-copy');
const fs = require('fs');

gulp.task('materialize-bug-fix', function (done) {
  const libLocation = `${__dirname}/node_modules/pickadate/lib/picker.js`;
  const missingLibFile = `${__dirname}/node_modules/materialize-css/bin/picker.js`;
  
  fs.lstat(missingLibFile, function (err, stats) {
    if (err && err.code !== 'ENOENT') {
      done(err);
      return;
    }
    if ((err && err.code === 'ENOENT') || !stats.isSymbolicLink()) {
      symlink();
    } else done();
  });
  
  function symlink() {
    fs.symlink(libLocation, missingLibFile, function (err) {
      if (err) throw err;
      done();
    });
  }
});

gulp.task('js-src', function () {
  const babel = require('gulp-babel');
  const gulpBrowser = require('gulp-browser');
  return gulp.src(['src/*.js', 'src/*/*.js'], {base: './'})
    .pipe(babel())
    .pipe(gulpBrowser.browserify())
    .pipe(gulp.dest('./build/'));
});

gulp.task('copy-src', function () {
  return gulp.src(['src/*/*', 'src/*', '!src/*.js', '!src/*/*.js'])
    .pipe(copy('./build/src', {prefix: 1}));
});

gulp.task('copy-css', function () {
  return gulp.src('node_modules/materialize-css/dist/css/materialize.min.css')
    .pipe(copy('./build/src', {prefix: 4}));
});

gulp.task('copy-fonts', function () {
  return gulp.src('node_modules/materialize-css/dist/fonts/roboto/*')
    .pipe(copy('./build/src/fonts/roboto', {prefix: 5}));
});

gulp.task('extension', function () {
  const crx = require('gulp-crx-pack');
  let pKey;
  try {
    // This doesn't have to exist
    pKey = fs.readFileSync('./ext.pem', 'utf8');
  } catch (e) {
    pKey = undefined;
  }
  return gulp.src('./build/src')
    .pipe(crx({
      privateKey: pKey,
      filename: 'ext.crx'
    }))
    .pipe(gulp.dest('./build/dist'));
});

gulp.task('plugins', function (done) {
  const cp = require('child_process');
  const async = require('async');
  fs.readdir('./plugins', function (err, folders) {
    if (err) throw err;
    let bundleTasks = folders.map(folderName => function (callback) {
      // If there are other things there, ignore them
      if (folderName.startsWith('.')) {
        callback(null);
        return;
      }
      cp.exec(`node bundler.js plugins/${folderName} build/plugins/${folderName}.json`, (err, stdout, stderr) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, stdout.toString());
      });
    });
    async.parallel(bundleTasks, function (err, results) {
      if (err) throw err;
      done();
    });
  });
});

gulp.task('pack-plugins', function () {
  const zip = require('gulp-zip');
  return gulp.src('./build/plugins/*')
    .pipe(zip('plugins.zip'))
    .pipe(gulp.dest('./build/dist/'));
});

gulp.task('default', sequence(['materialize-bug-fix', 'js-src', 'copy-src', 'copy-css', 'copy-fonts']));

gulp.task('all', sequence(['default', 'extension', 'plugins', 'pack-plugins']));

function createVersionTask(bumpType) {
  const merge = require('merge-stream');
  const gulpBump = require('gulp-bump');
  return function () {
    let packageJson =
    gulp.src('./package.json')
      .pipe(gulpBump({type: bumpType}))
      .pipe(gulp.dest('./'));
    let manifestJson =
    gulp.src('./src/manifest.json')
      .pipe(gulpBump({type: bumpType}))
      .pipe(gulp.dest('./src/'));
    return merge([packageJson, manifestJson]);
  };
}

gulp.task('patch', createVersionTask('patch'));
gulp.task('minor', createVersionTask('minor'));
gulp.task('major', createVersionTask('major'));
