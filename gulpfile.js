// Util
const gulp            = require('gulp');
const flatmap         = require('gulp-flatmap');

// Sass
const sass            = require('gulp-sass');
const autoprefixer    = require('gulp-autoprefixer');

// JS
const rollup          = require('rollup');
const rollupEach      = require('gulp-rollup-each');
const rollupResolve   = require('@rollup/plugin-node-resolve');
const rollupBabel     = require('@rollup/plugin-babel');
const rollupCommon    = require('@rollup/plugin-commonjs');
const rollupESLint    = require('@rollup/plugin-eslint');
const uglify          = require('gulp-uglify');

// // Definitions
// let production        = yargs.production ? yargs.production : false;

// //
// // Check to see if a .gulp-config.json file exists, if
// // not, creates one from .ex-gulp-config.json
// //
// const setProductionTrue = done => {
//   production = true;
//   done();
// };

const compileSass = (stream, css_dest_path) => {
  return (
    stream
      .pipe(
        sass({
          includePaths: ['node_modules'],
        }).on('error', sass.logError)
      )
      .pipe(
        autoprefixer({
          grid: true,
        })
      )
      .pipe(gulp.dest(css_dest_path))
  )
};


gulp.task('sass', () => {
  return gulp
    .src('src/scss/*.scss')
    .pipe(
      flatmap(stream => {
        return compileSass(stream, 'assets/');
      })
    );
});

//
// Javascript
//
gulp.task('js', () => {
  return gulp
    .src(['src/js/*.js'])
    .pipe(
      rollupEach(
        {
          // external: [],
          plugins: [
            rollupCommon(),
            rollupBabel.babel({
              babelHelpers: 'bundled',
              exclude: [/\/core-js\//],
            }),
            rollupResolve.nodeResolve(),
            // rollupESLint(),
          ],
        },
        {
          format: 'es',
          // globals: {}
        },
        rollup
      )
    )
    .pipe(gulp.dest('assets/'));
});


//
// Watch Task
//
gulp.task('watch', () => {
  gulp.watch('src/scss/**/*.scss',  gulp.series('sass'));
  gulp.watch('src/js/*.js',         gulp.series('js'));
});