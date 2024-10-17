const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

// SCSS стили
function styles() {
    return src('src/scss/style.scss')
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('src/css'))
        .pipe(browserSync.stream());
}

// JS скрипты
function scripts() {
    return src('src/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js'))
        .pipe(browserSync.stream());
}

// Копирование шрифтов
function fonts() {
    return src('src/fonts/**/*')
        .pipe(dest('dist/fonts'));
}

// Копирование изображений
function images() {
    return src('src/images/**/*')
        .pipe(dest('dist/images'));
}

// Следим за файлами
function watching() {
    watch(['src/scss/style.scss'], styles);
    watch(['src/js/main.js'], scripts);
    watch(['src/fonts/**/*'], fonts);
    watch(['src/images/**/*'], images); // Следим за изменениями изображений
    watch(['src/*.html']).on('change', browserSync.reload);
}

// Инициализация BrowserSync
function browsersync() {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
}

// Очистка папки dist перед сборкой
function cleanDist() {
    return src('dist')
        .pipe(clean());
}

// Построение проекта
function building() {
    return src(['src/css/style.min.css', 'src/js/main.min.js', 'src/**/*.html'], { base: 'src' })
        .pipe(dest('dist'));
}

// Экспорт задач
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images; // Добавляем задачу для изображений
exports.watching = watching;
exports.browsersync = browsersync;
exports.build = series(cleanDist, fonts, images, building); // Добавляем в билд процесс
exports.default = parallel(styles, scripts, browsersync, watching);