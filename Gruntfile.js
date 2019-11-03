module.exports = function (grunt) {
    require("json5/lib/register");

    if (grunt.option("with-time")) {
        require("time-grunt")(grunt);
    }

    grunt.option("stack", true);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        globalConfig: {}
    });

    // Load grunt configurations automatically
    require("load-grunt-config")(grunt, {
        jitGrunt: {
            staticMappings: {
                ftp_push: "grunt-ftp-push"
            },
        },
        init: true,
        // data passed into config.  Can use with <%= key %>
        data: {}
    });
};