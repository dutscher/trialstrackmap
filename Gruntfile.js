module.exports = function (grunt) {

    require("json5/lib/require");
    require("time-grunt")(grunt);

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

    grunt.registerTask("mergePublicTimesToDatabase", function () {
        // backup
        grunt.task.run("copy:timesBackup");
        // merge to /build and copy to database
        grunt.task.run("mergePublicWithProdTimes");
        grunt.task.run("copy:timesToDatabase");
        // clear
        grunt.task.run("clearTimes");
        // deploy
        grunt.task.run("deploy");
    });

    grunt.registerTask("mergePublicWithProdTimes", function () {
        var publicTimes = JSON.parse(grunt.file.read("dist/times.json"));
        var prodTimes = JSON.parse(grunt.file.read("database/times.json"));

        publicTimes.times.forEach(function (track) {
            prodTimes.times.forEach(function (_track_, index) {
                if (parseInt(track.id) == parseInt(_track_.id)) {
                    prodTimes.times[index] = track
                }
            })
        });

        grunt.file.write("build/times.json", JSON.stringify(prodTimes, null, 2));
    });

    grunt.registerTask("clearTimes", function () {
        grunt.file.write("dist/times.json", "[]");
    });

    grunt.registerTask("convertOriginToDatabase", function () {
        var friendsJSON = JSON.parse(grunt.file.read("database/raw/friends-ubisoft.json")),
            friendNames = [];

        friendsJSON.friends.forEach(function (friendData) {
            if (friendData.state == "Friends") {
                friendNames.push(friendData.nameOnPlatform + ":" + friendData.pid);
            }
        });

        //grunt.file.write("database/friends.json", JSON.stringify(friendNames, null, 2));
    });

    grunt.registerTask("deploy", [
        "clean:dist",
        "concat-json:database",
        "copy:i18nToDist",
        "copy:rawToDist",
        "concat:dist",
        "concat:vendor",
        "minjson:dist",
        "minjson:distI18n"
    ]);

    grunt.registerTask("finalDeploy", [
        "deploy",
        "uglify:dist"
    ]);

    grunt.registerTask("server", [
        "deploy",
        "connect:dist",
        "watch"
    ]);

    grunt.registerTask("default");
};