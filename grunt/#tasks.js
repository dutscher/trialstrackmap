module.exports = function (grunt) {
    grunt.registerTask("deploy",  function() {
        grunt.task.run([
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
    });

    grunt.registerTask("#finalDeploy", [
        "deploy",
        "uglify:dist"
    ]);

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

    grunt.registerTask("#testConfig", []);
    grunt.registerTask("#startImport", [
        "import1GameDataPhone",
        "import2GameDataS3",
        "import3DoUnpacking",
        "import4DoPackagesToOneDir",
        "import5ConvertOri2Json",
        "import6GameDataViaJson",
        "import7ConvertLanguages",
        "import8GetLanguageHashes",
        "import9GetTrackNamesViaHashes",
    ]);
};