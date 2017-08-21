import gulp from 'gulp';
import sass from 'gulp-sass';
import webpack from 'webpack';
import livereload from 'gulp-livereload';
import webpackConfig from './webpack.config';
import sassInlineImage from 'sass-inline-image';
import server from 'gulp-webserver';
import copy from 'gulp-copy';


gulp.task('build-sass', () => {

  let conf = {
    functions: sassInlineImage(),
  }

  return gulp.src(['./src/sass/global.scss'])
    .pipe(sass(conf).on('error', sass.logError))
    .pipe(gulp.dest('dist'))
    .on('end', () => {
      livereload.changed('SASS built');
    });

});


gulp.task('copy-html', () => {

  return gulp.src('./src/html/**/*.html')
    .pipe(gulp.dest('dist'))
    .on('end', () => {
      livereload.changed('HTML copied');
    });

});


gulp.task('build-js', (cb) => {

  webpack(webpackConfig, () => {
    cb();
  });

});

gulp.task('watch', () => {

  livereload.listen({
    port: 35729,
  });

  gulp.watch('./src/sass/**/*', ['build-sass']);

  webpack(webpackConfig).watch(1000, (err, stats) => {
    livereload.changed('Webpack');
  });

  gulp.src('./dist')
    .pipe(server({
      directoryListing: {
        enable: false,
        path: './dist',
      },
      host: '127.0.0.1',
    }));


  gulp.watch('./src/html/**/*.html}', ['copy-html'], () => {

  });

})


gulp.task('build', ['copy-html', 'build-sass', 'build-js']);