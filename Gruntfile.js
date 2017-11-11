module.exports = function (grunt) {
    require("json5/lib/require");
    if (grunt.option("with-time")) {
        require("time-grunt")(grunt);
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        globalConfig: {}
    });

    // Load grunt configurations automatically
    require("load-grunt-config")(grunt, {
        jitGrunt: true,
        init: true,
        // data passed into config.  Can use with <%= key %>
        data: {}
    });
}