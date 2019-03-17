const gulp = require('gulp');
const exec = require('child_process').exec;
const bs = require('browser-sync').create();

gulp.task('jekyll:build', function(done) {
  exec('jekyll build', function(error, stdout, stderr) {
    if (error) {
      console.log(`exec error ${error}`);
      return ;
    }

    console.log(`exec stdout ${stdout}`);
    console.log(`exec stderr ${stderr}`);

    done();
  });
});


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
  gulp.watch('*.html').on('change', gulp.series('jekyll:rebuild'));
});


gulp.task('serve', gulp.parallel('browser-sync', 'watch'));
