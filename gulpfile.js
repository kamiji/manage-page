var gulp     = require('gulp'),
jade         = require('gulp-jade'),
uglify       = require('gulp-uglify'),
livereload   = require('gulp-livereload'),
st           = require('st'),
http         = require('http'),
stylus       = require('gulp-stylus'),
autoprefixer = require('gulp-autoprefixer'),
del          = require('del'),
header       = require('gulp-header'),
rev          = require('gulp-rev'),
revCollector = require('gulp-rev-collector'),
gutil        = require('gulp-util'),
webpack      = require('webpack'),
webpack_config = require('./webpack.config.js');

var head = ['/**',
            '*',
            '**/\n'
].join('\n');

gulp.task('del',function(){
    var deletedFiles = del.sync(['app/dest/*']);
    console.log('Files deleted:', deletedFiles.join(', '));
});

gulp.task('live',function(){
    livereload.listen();
    gulp.watch('app/src/jade/**/*.jade',['html']);
    gulp.watch('app/src/js/**/*.js',['js']);
    gulp.watch('app/src/styl/**/*.styl',['styl']);
    gulp.watch('app/src/images/**/*',['images']);
});

gulp.task("webpack", function(callback) {
    webpack(webpack_config, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
        }));
        callback();
    });
});

//注意这样生成的js页面上引用的话是用build这个目录的资源,而不是pages目录
gulp.task('js',['webpack'],function(){
    gulp.src('app/src/js/**/*.js')
    .pipe(header(head))
    .pipe(gulp.dest('app/dest/js'))
    .pipe(livereload());
});

//生成文件名的hash code,生成manifest
gulp.task('js_build',['webpack'],function(){
    gulp.src('app/src/js/**/*.js')
    .pipe(uglify())
    .pipe(header(head))
    .pipe(rev())
    .pipe(gulp.dest('app/dest/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('app/dest/rev/js'))
});

gulp.task('styl',function(){
    gulp.src('app/src/styl/**/*.styl')
    .pipe(stylus({
        'include css': true
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('app/dest/css'))
    .pipe(livereload());
});

//生成文件名的hash code,生成manifest
gulp.task('styl_build',function(){
    gulp.src('app/src/styl/**/*.styl')
    .pipe(stylus({
        'include css': true
    }))
    .pipe(autoprefixer())
    .pipe(rev())
    .pipe(gulp.dest('app/dest/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('app/dest/rev/css'))
});

gulp.task('html',function(){
    gulp.src('app/src/jade/pages/*.jade')
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest('app/dest/html'))
    .pipe(livereload());
});

gulp.task('fonts',function(){
    gulp.src('app/src/styl/fonts/*')
    .pipe(gulp.dest('app/dest/css/fonts'))
    .pipe(livereload());
})

gulp.task('images',function(){
    gulp.src('app/src/images/**/*')
    .pipe(gulp.dest('app/dest/images'))
    .pipe(livereload());
});

// 为html上的引用的css样式与js加上特定的版本号
gulp.task('build',['del','styl_build','js_build','images','html'],function(){
    gulp.src(['app/dest/rev/**/*.json','app/dest/html/*.html'])
    .pipe(revCollector({
        replaceReved: true,
    }))
    .pipe(gulp.dest('app/dest/html'))
});

gulp.task('server',['del','js','styl','html','images','live'], function(done) {
    http.createServer(st({ path: __dirname + '/app/dest/', cache: false })).listen(8080, done);
});

gulp.task('default',['del','fonts','styl','js','html','images']);
