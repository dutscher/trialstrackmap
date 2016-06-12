module.exports = function (grunt) {
    grunt.registerTask("deploy", [
        "clean:dist",
        "concatDatabase",
        "copy:i18nToDist",
        "copy:rawToDist",
        "convertLess",
        "concat:dist",
        "concat:vendor",
        "minjson:dist",
        "minjson:distI18n",
        "deployHtml"
    ]);

    grunt.registerTask("finalDeploy", [
        "doBackup",
        "finalDeployWithoutBackup"
    ]);

    grunt.registerTask("finalDeployWithoutBackup", [
        "deploy",
        "uglify:dist"
    ]);

    grunt.registerTask("doBackup", [
        "backupMyJson"
    ]);
}