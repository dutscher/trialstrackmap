module.exports = function (grunt) {

    var config = require("./connect-config.json5");

    return {
        options: {
            livereload: config.livereload
        },
        lib: {
            files: [
                "lib/**/*.js",
                "vendor/bonxy/*.js"
            ],
            tasks: [
                "concat:dist"
            ],
            options: {
                livereload: config.livereload
            }
        },
        html: {
            files: [
                "./*.html"
            ],
            options: {
                livereload: config.livereload
            }
        },
        assemble: {
            files: [
                "./tpls/**/*.hbs",
                "./tpls/**/*.js"
            ],
            tasks: [
                "deployHtml"
            ],
            options: {
                livereload: config.livereload
            }
        },
        less: {
            files: [
                "./css/**/*.less",
                "./css/**/*.css",
                "./grunt/less.js"
            ],
            tasks: [
                "convertLess"
            ],
            options: {
                livereload: config.livereload
            }
        },
        database: {
            files: [
                "database/**/*.{json,json5}",
                "!database/i18n/*"
            ],
            tasks: [
                "deploy"
            ],
            options: {
                livereload: config.livereload
            }
        },
        i18n: {
            files: [
                "database/i18n/*.{json,json5}"
            ],
            tasks: [
                "copy:i18nToDist"
            ],
            options: {
                livereload: config.livereload
            }
        }
    }
};