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

    grunt.registerTask("danTeamImport", () => {
        grunt.task.run([
            "import-09-danteam",
            "deployDanTeam",
        ]);
    });

    grunt.registerTask("#danTeamImportAndUpload", () => {
        grunt.task.run([
            "danTeamImport",
            "danTeamUpload",
        ]);
    });

    grunt.registerTask("danTeamUpload", () => {
        grunt.task.run([
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
            "import-07-i18n",
        ]);
    });

    grunt.registerTask("#startImportI18N", () => {
        grunt.task.run([
            "import-06-gameDataViaJson",
            "import-07-i18n",
        ]);
    });
};