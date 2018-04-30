module.exports = function (grunt) {
    grunt.registerTask("deploy", function () {
        grunt.task.run([
            "clean:dist",
            "concatDatabase",
            "copy:i18nToDist",
            "copy:rawToDist",
            "convertLess",
            "concat",
            "minjson:dist",
            "minjson:distI18n",
            "deployHtml"
        ]);
    });

    grunt.registerTask("#finalDeploy", [
        "deploy",
        "uglify:dist"
    ]);

    grunt.registerTask("finalDeployWithBackup", function () {
        grunt.task.run([
            "doBackup",
            "finalDeploy"
        ]);
    });

    grunt.registerTask("doBackup", function () {
        grunt.task.run([
            "backupMyJson"
        ]);
    });

    grunt.registerTask("#testConfig", []);

    grunt.registerTask("#checkImport", [
        "import-00-CheckImport"
    ]);

    grunt.registerTask("#startImport", [
        "import-01-gameDataPhone",
        "import-02-gameDataS3",
        "import-03-doUnpacking",
        "import-04-doPackagesToOneDir",
        "import-05-convertOri2Json",
        "import-06-gameDataViaJson",
        "import-07-convertLanguages",
        "import-08-getLanguageHashes",
        "import-09-getTrackNamesViaHashes"
    ]);

    grunt.registerTask("#startImportI18N", [
        "import-06-gameDataViaJson",
        "import-07-convertLanguages",
        "import-08-getLanguageHashes",
        "import-09-getTrackNamesViaHashes"
    ]);
};