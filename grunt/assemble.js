module.exports = function (grunt) {

    grunt.registerTask("deployHtml", [
        "clean:assemble",
        "assemble",
        "copy:indexToRoot"
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
            ],
            lastUpdateTime: (new Date()).getTime(),
            cacheBuster: "?v=" + (new Date()).getTime()
        },
        default: {
            files: {
                "dist": [ "tpls/pages/*.hbs" ]
            }
        }
    }
};