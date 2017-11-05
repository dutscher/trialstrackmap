module.exports = function (grunt) {

    grunt.registerTask("deployHtml",  function() {
        grunt.task.run([
            "clean:assemble",
            "assemble",
            "copy:indexToRoot"
        ]);
    });

    return {
        options: {
            flatten: true,
            data: ["dist/*.json"],
            layout: false,
            helpers: "tpls/helpers/*.js",
            partials: [
                "tpls/partials/**/*.hbs",
                "tpls/layouts/*.hbs"
            ],
            year: (new Date()).getFullYear(),
            lastUpdateTime: (new Date()).getTime(),
            lastUpdateTimeISO: (new Date()).toISOString(),
            cacheBuster: "?v=" + (new Date()).getTime()
        },
        default: {
            src: ["tpls/pages/**/*.hbs"],
            dest: "dist"
        }
    }
};