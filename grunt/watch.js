module.exports = function (grunt) {

    var config = require("./config/connect.json5");

    return {
        options: {
            livereload: config.livereload
        },
        lib: {
            files: [
                "lib/**/*.js"
            ],
            tasks: [
                "concat:dist",
                "testUnit"
            ],
            options: {
                livereload: config.livereload
            }
        },
        html: {
            files: [
                "./*.html",
                "./css/*.css"
            ],
            options: {
                livereload: config.livereload
            }
        },
        assemble: {
            files: [
                "./tpls/**/*.hbs"
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
                "./grunt/less.js"
            ],
            tasks: [
                "less:dist"
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