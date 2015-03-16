/// <reference path="typings.d.ts" />
import chalk = require('chalk');
import del = require('del');
import runSequence = require('run-sequence');
import gulp = require('gulp');
var plumber: IGulpPlugin = require('gulp-plumber');
var notify: any = require('gulp-notify');
import mocha = require('gulp-mocha');
require('require-dir')('./gulp');

gulp.task('default', callback => {
    runSequence('build', 'test', 'watch', callback);
});
gulp.task('release', callback => {
    runSequence('build-release', 'test', callback);
});
gulp.task('clean', callback => {
    runSequence(['global-clean', 'ts-clean'], callback);
});
gulp.task('global-clean', callback => {
    del('tmp/', callback);
});
gulp.task('build', callback => {
    runSequence('ts', callback);
});
gulp.task('build-release', ['clean'], callback => {
    runSequence('ts-release', callback);
});
gulp.task('test',() => {
    require('coffee-script/register');
    return gulp.src('test/**/*.coffee', { read: false })
        .pipe(plumber(
        {
            errorHandler: notify.onError({
                sound: true,
                message: '<%= error.message %>'
            })
        }))
        .pipe(mocha({ reporter: 'nyan' }));
});
gulp.task('watch', callback => {
    runSequence(['global-watch', 'ts-watch'], callback);
});
gulp.task('global-watch',() => {
    gulp.watch('test/**/*', ['cutoff-line', 'test']);
});
gulp.task('cutoff-line',() => {
    console.log();
    console.log();
    console.log(chalk.green('✄------------------------------------ｷﾘﾄﾘ線------------------------------------✄'));
    console.log();
    console.log();
});
