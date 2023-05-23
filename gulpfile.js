const { src, dest, parallel, series, watch } = require('gulp');

const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const del = require('del');
const browsersync = require('browser-sync').create();

const paths = {
  root: '.',
  scss: 'src/scss/**/*.scss',
  pug: 'src/pug/**/[!_]*.pug',
  html: 'dist/html/**/*.html',
  js: 'src/js/**/*.js',
  assets: 'src/assets/**/*',
};

function clean(cb) {
  del(['dist']);
  cb();
}

// Pug Task
function html(cb) {
  src(paths.pug)
    .pipe(pug({ pretty: true }))
    .pipe(dest('dist'));

  cb();
}

// Sass Task
function scss(cb) {
  src(paths.scss, { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer({}), cssnano()]))
    .pipe(dest('dist/css', { sourcemaps: paths.root }))
    .pipe(browsersync.stream());

  cb();
}

// JavaScript Task
function javascript(cb) {
  src(paths.js, { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('dist/js', { sourcemaps: paths.root }));

  cb();
}

// Copy assets
function assets(cb) {
  src(paths.assets).pipe(dest('dist/assets'));

  cb();
}

// Browsersync Task
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      proxy: 'http://localhost:8080',
      baseDir: `${paths.root}/dist`,
    },
    notify: false,
  });

  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();

  cb();
}

// Watch Task
function watchTask(cb) {
  watch(paths.scss, series(scss, browsersyncReload));
  watch(paths.pug, series(html, browsersyncReload));
  watch(paths.js, series(javascript, browsersyncReload));
  watch(paths.assets, series(assets, browsersyncReload));
  watch(paths.html, browsersyncReload);

  cb();
}

// Default Gulp task
exports.default = series(
  parallel(html, scss, javascript, assets),
  browsersyncServe,
  watchTask
);

exports.build = series(clean, parallel(html, scss, javascript, assets));
