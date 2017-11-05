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

    grunt.registerTask("deploy",  function() {
        grunt.task.run([
            "clean:dist",
            "#concatDatabase",
            "copy:i18nToDist",
            "copy:rawToDist",
            "convertLess",
            "concat:dist",
            "concat:vendor",
            "minjson:dist",
            "minjson:distI18n",
            "deployHtml"
        ]);
    });

    grunt.registerTask("finalDeploy",  function() {
        grunt.task.run([
            "deploy",
            "uglify:dist"
        ]);
    });

    grunt.registerTask("finalDeployWithBackup",  function() {
        grunt.task.run([
            "doBackup",
            "finalDeploy"
        ]);
    });

    grunt.registerTask("doBackup",  function() {
        grunt.task.run([
            "backupMyJson"
        ]);
    });
};