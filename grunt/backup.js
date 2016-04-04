module.exports = function (grunt) {
    var myJsonHost = "api.myjson.com",
        myJsonPath = "/bins/",
        idStorageID = "3imst",
        worldRecordsID = "3s1ot",
        backupPath = "database/backup/";

    grunt.registerTask("backupMyJson", [
        "backupMyjsonIDs",
        "backupMyJsonWRs"
    ]);

    grunt.registerTask("backupMyjsonIDs", function () {
        var done = this.async();
        backupMyJson(idStorageID, createFileName("ids"), done);
    });

    grunt.registerTask("backupMyJsonWRs", function () {
        var done = this.async();
        backupMyJson(worldRecordsID, createFileName("wrs"), done);
    });

    function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function humanReadableDate(timestamp) {
        var date = timestamp ? new Date(timestamp) : new Date(),
            dateValues = [
                date.getFullYear(),
                pad(date.getMonth() + 1, 2),
                pad(date.getDate(), 2),
                ".",
                pad(date.getHours(), 2),
                pad(date.getMinutes(), 2),
                pad(date.getSeconds(), 2)
            ];
        return dateValues.join("");
    }

    function createFileName(dirName, extension){
        var hrDate = humanReadableDate((new Date()).getTime());
        return dirName + "/" + hrDate + "." + (extension || "json");
    }

    function backupMyJson(id, filename, done) {
        var http = require("http"),
            options = {
                host: myJsonHost,
                path: myJsonPath + id,
                method: "GET"
            };

        var req = http.request(options, function (res) {
            var output = "";
            res.setEncoding("utf8");

            res.on("data", function (chunk) {
                output += chunk;
            });

            res.on("end", function () {
                grunt.file.write(
                    backupPath + filename,
                    output
                );
                done();
            });
        });

        req.on("error", function (err) {
            console.log("error: " + err.message);
        });

        req.end();
    }
};