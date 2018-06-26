module.exports = (grunt) => {
    grunt.registerTask("deploy", () => {
        grunt.task.run([
            "clean:dist",
            "concatDatabase",
            "copy:i18nToDist",
            "copy:rawToDist",
            "convertLess",
            "concat",
            "minjson:dist",
            "minjson:distI18n",
            "deployHtml",
            "deployDanTeam",
        ]);
    });

    grunt.registerTask("#finalDeploy", () => {
        grunt.task.run([
            "deploy",
            "uglify:dist",
        ]);
    });

    grunt.registerTask("#danTeamImport", () => {
        grunt.task.run([
            "import-11-danteam",
            "#danTeamYoDeploy",
        ]);
    });

    grunt.registerTask("#danTeamYoDeploy", () => {
        grunt.task.run([
            "deployDanTeam",
            "ftp_push:danTeam",
        ]);
    });

    grunt.registerTask("deployDanTeam", () => {
        grunt.task.run([
            "concat-json:danTeam",
            "copy:danTeam",
            "deployHtmlDanTeam",
        ]);
    });

    grunt.registerTask("finalDeployWithBackup", () => {
        grunt.task.run([
            "doBackup",
            "finalDeploy"
        ]);
    });

    grunt.registerTask("doBackup", () => {
        grunt.task.run([
            "backupMyJson"
        ]);
    });

    grunt.registerTask("#checkImport", () => {
        grunt.task.run([
            "import-00-checkImport"
        ]);
    });

    grunt.registerTask("#startImport", () => {
        grunt.task.run([
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
    });

    grunt.registerTask("#startImportI18N", () => {
        grunt.task.run([
            "import-06-gameDataViaJson",
            "import-07-convertLanguages",
            "import-08-getLanguageHashes",
            "import-09-getTrackNamesViaHashes"
        ]);
    });
};