var gulp = require("gulp");

var sass = require("gulp-sass");

gulp.task("sass", function() {
	return gulp.src("app/sass/**/*.sass")
	.pipe(sass())
	.pipe(gulp.dest("app/css"))
	.pipe(browserSync.reload({stream: true}))
});

var browserSync = require("browser-sync").create();

gulp.task("browserSync", function() {
	browserSync.init({
		server: {baseDir: "app", index: "index.html"},
	})
});

gulp.task("test", ["browserSync", "pug", "sass"], function(){
	gulp.watch("app/pugs/*.pug", ["pug"]);
	gulp.watch("app/**/*.html", browserSync.reload);
	gulp.watch("app/**/*.sass", ["sass"]);
	gulp.watch("app/**/*.css", browserSync.reload);
	gulp.watch("app/js/**/*.js", browserSync.reload);
	gulp.watch("app/js/json/**/*.json", browserSync.reload);
});

var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var cssnano = require("gulp-cssnano");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var pug = require("gulp-pug");
var htmlmin = require("gulp-htmlmin");

gulp.task("useref", function(){
	return gulp.src("app/index.html")
	.pipe(useref())
	.pipe(gulpIf("*.js", uglify()))
	.pipe(gulpIf("*.css", cssnano()))
	.pipe(gulpIf("*.html", htmlmin({collapseWhitespace: true})))
	.pipe(gulp.dest("dist"))
});

gulp.task("minjs",function(){
	return gulp.src("app/js/*.min.js")
	.pipe(gulp.dest("dist/js"))
});

gulp.task("images", function(){
	return gulp.src("app/img/**/*.+(png|jpg|gif|svg)")
	.pipe(cache(imagemin()))
	.pipe(gulp.dest("dist/img"))
});

gulp.task("fonts",function(){
	return gulp.src("app/fonts/**/*")
	.pipe(gulp.dest("dist/fonts"))
});

//Limpiar Dist

var del = require("del");

gulp.task ("clean:dist", function(){
	return del.sync("dist");
});

//Armar el sitio

var runSequence = require("run-sequence");

gulp.task ("build", function(callback){
	runSequence("clean:dist", "sass", "pug", "useref", "pug2", "images", "fonts", "minjs", callback)
});

//Pugs

gulp.task ("pug", function(){
	return gulp.src(["app/pugs/*.pug", "!app/pugs/head.pug"])
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest("app"))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task ("pug2", function(){
	return gulp.src(["app/pugs/*.pug", "!app/pugs/index.pug"])
	.pipe(pug({pretty: true}))
	.pipe(gulp.dest("dist"))
	.pipe(gulpIf("*.html", htmlmin({collapseWhitespace: true})))
});

gulp.task("runBuild", function() {
	browserSync.init({
		server: {baseDir: "dist", index: "index.html"},
	})
});