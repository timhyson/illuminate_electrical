// Assigning modules to local variables
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Compile Sass files from /sass into /css
gulp.task('sass', function() {
    return gulp.src('public/sass/**/*.scss')
        .pipe(sass())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
    return gulp.src('public/css/grayscale.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('public/js/grayscale.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('bootstrap', function() {
    return gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('public/vendor/bootstrap'))
})

// Copy jQuery core files from node_modules to vendor directory
gulp.task('jquery', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('public/vendor/jquery'))
})

// Copy Font Awesome core files from node_modules to vendor directory
gulp.task('fontawesome', function() {
    return gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('public/vendor/font-awesome'))
})

// Copy all dependencies from node_modules
gulp.task('copy', ['bootstrap', 'jquery', 'fontawesome']);

// Run everything
gulp.task('default', ['sass', 'minify-css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'minify-css', 'minify-js'], function() {
    // gulp.watch('public/less/*.less', ['less']);
    gulp.watch('public/sass/*.scss', ['sass']);
    gulp.watch('public/css/*.css', ['minify-css']);
    gulp.watch('public/js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('**/*.html', browserSync.reload);
    gulp.watch('**/js/**/*.js', browserSync.reload);
});
