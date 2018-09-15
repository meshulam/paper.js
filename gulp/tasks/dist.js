/*
 * Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2016, Juerg Lehni & Jonathan Puckey
 * http://scratchdisk.com/ & http://jonathanpuckey.com/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

var gulp = require('gulp'),
    del = require('del'),
    zip = require('gulp-zip');

gulp.task('dist', ['build', 'minify']);

gulp.task('zip', ['clean:zip', 'dist'], function() {
    return gulp.src([
            'dist/paper-full*.js',
            'dist/paper-core*.js',
            'dist/node/**/*',
            'LICENSE.txt',
            'examples/**/*',
        ], { base: '.' })
        .pipe(zip('paperjs.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean:zip', function() {
    return del([
        'dist/paperjs.zip'
    ]);
});
