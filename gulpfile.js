'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const babel = require('gulp-babel');

// deletes the dist folder
gulp.task('clean', require('del').bind(null, ['dist']));
gulp.task('clean-tmp', require('del').bind(null, ['dist/tmp']));

// build css
gulp.task('styles', function () {
    return gulp.src(['./src/**/*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('style.min.css'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist'));
});

// build js
gulp.task('babel', function () {
    return gulp.src(['./src/**/*.js'])
        .pipe(babel())
        .pipe(gulp.dest('dist/tmp'));
});
const webpackDev = require('./config/webpack.dev');
const webpackProd = require('./config/webpack.prod');
gulp.task('build-dev', (done) => {
    webpackStream(webpackDev, webpack).pipe(gulp.dest('dist'));
    done();
});
gulp.task('build-prod', (done) => {
    webpackStream(webpackProd, webpack).pipe(gulp.dest('dist'));
    done();
}); 
gulp.task('scripts', () => {    
    return gulp.parallel('build-prod', 'build-dev');
});

// Create a new build in dist folder
gulp.task('build', gulp.series(
    'clean',
    'babel',
    gulp.parallel('styles', 'scripts'),
    'clean-tmp'
));