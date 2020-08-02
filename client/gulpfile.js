const { src, dest } = require('gulp'),
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),
  cleanCSS = require('gulp-clean-css');


function watchFiles(params) {
  gulp.watch('./src/sass/**/**', css)
}

// Сборка CSS
function css() {
  return src('./src/sass/style.sass')
    .pipe(sass())
    //gulp-autoprefixer
    .pipe(
      group_media()
    )
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 5 versions"],
      cascade: true
    }))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(dest('./src/css/'))
}



exports.default = watchFiles;