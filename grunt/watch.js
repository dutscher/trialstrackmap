module.exports = function (grunt) {

    var config = require("./connect-config.json5");

    return {
        options: {
            livereload: config.livereload
        },
        lib: {
            files: [
                "lib/**/*.js"
            ],
            tasks: [
                "concat:dist"
            ]
        },
        html: {
            files: [
                "./*.html",
                "./css/*.css"
            ]
        },
        assemble: {
            files: [
                "./tpls/**/*.hbs"
            ],
            tasks: [
                "deployHtml"
            ]
        },
        less: {
            files: [
                "./css/**/*.less"
            ],
            tasks: [
                "less:dist"
            ]
        },
        database: {
            files: [
                "database/**/*.{json,json5}"
            ],
            tasks: [
                "deploy"
            ]
        }
    }
};