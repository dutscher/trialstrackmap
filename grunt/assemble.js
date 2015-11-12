module.exports = function (grunt) {

    grunt.registerTask("deployHtml", [
        "clean:assemble",
        "assemble"
    ]);

    return {
        options: {
            flatten: true,
            data: "dist/*.json",
            layout: false,
            helpers: "tpls/helpers/*.js",
            partials: [
                "tpls/partials/**/*.hbs",
                "tpls/layouts/*.hbs"
            ]
        },
        default: {
            files: {
                "dist": [ "tpls/pages/*.hbs" ]
            }
        }
    }
};