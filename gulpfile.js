const {src, dest, watch, parallel, series} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

function styles(){
    return src('src/scss/style.scss')
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle:'compressed'}))
    .pipe(dest('src/css'))
    .pipe(browserSync.stream());
}

function scripts(){
    return src('src/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js'))
    .pipe(browserSync.stream());
}

function fonts() {
    return src('src/fonts/**/*')
    .pipe(dest('dist/fonts'));
}

function watching(){
    watch(['src/scss/style.scss'], styles);
    watch(['src/js/main.js'], scripts);
    watch(['src/fonts/**/*'], fonts);
    watch(['src/*.html']).on('change', browserSync.reload);
}

function browsersync(){
    browserSync.init({
        server:{
            baseDir: "src/"
        }
    });
}

function cleanDist(){
    return src('dist')
    .pipe(clean());
}

function building(){
    return src(['src/css/style.min.css','src/js/main.min.js','src/**/*.html'], {base:'src'})
    .pipe(dest('dist'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.build = series(cleanDist, fonts, building);
exports.default = parallel(styles, scripts, browsersync, watching);