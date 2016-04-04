module.exports = {
    lib: {
        files: [
            "lib/**/*.js"
        ],
        tasks: [
            "concat:dist"
        ],
        options: {
            livereload: true
        }
    },
    html: {
        files: [
            "./*.html",
            "./css/*.css"
        ],
        options: {
            livereload: true
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
            livereload: true
        }
    },
    less: {
        files: [
            "./css/**/*.less"
        ],
        tasks: [
            "less:dist"
        ],
        options: {
            livereload: true
        }
    },
    database: {
        files: [
            "database/**/*.{json,json5}"
        ],
        tasks: [
            "deploy"
        ],
        options: {
            livereload: true
        }
    }
};