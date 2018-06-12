module.exports = function (grunt) {

    grunt.registerTask("deployHtml", function() {
        grunt.task.run([
            "clean:assemble",
            "assemble:default",
            "copy:indexToRoot"
        ]);
    });

    grunt.registerTask("deployHtmlDanTeam", function() {
        grunt.task.run([
            "assemble:danTeam"
        ]);
    });

    const options = {
        flatten: true,
        data: ["dist/json/*.json"],
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
    };

    return {
        options: options,
        default: {
            src: ["tpls/pages/**/*.hbs"],
            dest: "dist"
        },
        danTeam: {
            src: ["tpls/pages/danteam.hbs"],
            dest: "dist"
        }
    }
};