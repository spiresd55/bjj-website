var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

browserSync.create();

///////////////
// Variables
//////////////

var dirs = {
    'server': {
        'main' : 'app.js'
    }
}

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./server/"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('images', function(){
    gulp.src('client/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('client/dist/images/'));
});

gulp.task('styles', function(){
    gulp.src(['client/scss/**/*.scss'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('client/dist/styles/'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
    return gulp.src('client/js/**/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('client/dist/scripts/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('client/dist/scripts/'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('nodemon', function(cb) {
    nodemon({
        'script': dirs.server.main,
        'watch': dirs.server.main
    }).once('start', function() {
        cb();
    }).on('restart', function() {

    });
});

//TODO: Replace with environment configuration
gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init({
        proxy: "localhost:3000"
    });
});

gulp.task('default', ['browser-sync'], function(){
    gulp.watch("client/scss/**/*.scss", ['styles']);
    gulp.watch("client/js/**/*.js", ['scripts']);
    gulp.watch("*.html", ['bs-reload']);
});
