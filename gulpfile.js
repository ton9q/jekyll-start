const gulp = require('gulp');
const exec = require('child_process').exec;
const bs = require('browser-sync').create();
const sass = require('gulp-sass');


const path = {
  html: ['*.html', '_includes/*.html', '_layouts/*.html'],
  scss: 'scss/**/*.scss',
};


gulp.task('sass', function() {
  return gulp.src('scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('_site/assets/styles/'))
    .pipe(bs.stream())
    .pipe(gulp.dest('assets/styles'))
});


gulp.task('jekyll:build', gulp.series('sass', function(done) {
  exec('jekyll build', function(error, stdout, stderr) {
    if (error) {
      console.log(`exec error ${error}`);
      return ;
    }

    console.log(`exec stdout ${stdout}`);
    console.log(`exec stderr ${stderr}`);

    done();
  });
}));


gulp.task('browser-sync', gulp.series('jekyll:build', function() {
  bs.init({
    server: {
      baseDir: '_site'
    }
  });
}));


gulp.task('jekyll:rebuild', gulp.series('jekyll:build', function() {
  bs.reload();
}));


gulp.task('watch', function() {
  gulp.watch(path.html).on('change', gulp.series('jekyll:rebuild'));
  gulp.watch(path.scss).on('change', gulp.parallel('sass'));
});


gulp.task('serve', gulp.parallel('browser-sync', 'watch'));
