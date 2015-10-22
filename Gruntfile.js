module.exports = function(grunt) {

    function pad(n, width, z) {
        z = z || "0"
        n = n + ""
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
    }

    var backupDateObj = new Date(),
        backupDate = backupDateObj.getFullYear()+""+pad(backupDateObj.getMonth()+1,2)+""+pad(backupDateObj.getDate(),2)

    require("jit-grunt")(grunt);
    require("time-grunt")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        "concat-json": {
            database: {
                src: ["database/*.json"],
                dest: "build/map.json"
            },
            rawToDist: {
                files: [
                    {
                        src: ["database/raw/gfx.json"],
                        dest: "dist/gfx.json"
                    },
                    {
                        src: ["database/raw/seasons.json"],
                        dest: "dist/season.json"
                    }
                ]
            }
        },

        shell: {
            "python": {
                options: {
                    stdout: true
                },
                command: "python -m SimpleHTTPServer 8001"
            }
        },

        copy: {
            timesBackup: {
                src: "database/times.json",
                dest: "backup/times.bak."+backupDate+".json"
            },
            timesToDatabase: {
                src: "build/times.json",
                dest: "database/times.json"
            },
            i18nToDist: {
                flatten: true,
                expand: true,
                src: "database/i18n/*.json",
                dest: "dist/i18n/"
            },
            rawToDist: {
                files: [
                    {
                        flatten: true,
                        expand: true,
                        src: "database/raw/gfx.json",
                        dest: "dist/"
                    },
                    {
                        flatten: true,
                        expand: true,
                        src: "database/raw/seasons.json",
                        dest: "dist/"
                    }
                ]
            }
        },

        concat: {
            dist: {
                options: {
                    stripBanners: true,
                    banner: [
                        "'use strict';",
                        "",
                        "/*",
                        "The MIT License (MIT)",
                        "",
                        "Copyright (c) 2015 willy woitas http://trialstrackmap.sb-f.de",
                        "",
                        "Permission is hereby granted, free of charge, to any person obtaining a copy",
                        "of this software and associated documentation files (the 'Software'), to deal",
                        "in the Software without restriction, including without limitation the rights",
                        "to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
                        "copies of the Software, and to permit persons to whom the Software is",
                        "furnished to do so, subject to the following conditions:",
                        "",
                        "The above copyright notice and this permission notice shall be included in",
                        "all copies or substantial portions of the Software.",
                        "",
                        "THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
                        "IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
                        "FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
                        "AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
                        "LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
                        "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN",
                        "THE SOFTWARE.",
                        "*/"
                    ].join("\n"),
                    process: function(src, filepath) {
                        if(filepath.indexOf("map-module") >= 0)
                            return src;
                        return src.replace(/(^|\n)[ \t]*angular.module(.*)?\s*/g, "$1");
                    }
                },
                src: ["lib/map-module.js", "lib/**/!(map-module|.min)*.js"],
                dest: "dist/map.min.js"
            },
            vendor: {
                src: ["vendor/angular/angular-base.js","vendor/angular/!(angular-base)*.js","vendor/*.js"],
                dest: "dist/vendor.min.js"
            }
        },

        minjson: {
            dist: {
                files: {
                    "dist/seasons.json": ["dist/seasons.json"],
                    "dist/gfx.json": ["dist/gfx.json"],
                    "dist/map.json": ["build/map.json"]
                }
            },
            distI18n: {
                files: [{
                    expand: true,
                    cwd: "dist/i18n",
                    src: ["*.json"],
                    dest: "dist/i18n"
                }]
            }
        },

        uglify: {
            dist: {
                files: {
                    //"dist/map.min.js": "dist/map.min.js",
                    "dist/vendor.min.js": "dist/vendor.min.js"
                }
            }
        }
    })

    var stripJsonComments = require("strip-json-comments")
    //grunt.loadNpmTasks("grunt-contrib-clean")

    grunt.registerTask("default", ["deploy", "server"])

    grunt.registerTask("mergePublicTimesToDatabase", function(){
        // backup
        grunt.task.run("copy:timesBackup")
        // merge to /build and copy to database
        grunt.task.run("mergePublicWithProdTimes")
        grunt.task.run("copy:timesToDatabase")
        // clear
        grunt.task.run("clearTimes")
        // deploy
        grunt.task.run("deploy")
    })

    grunt.registerTask("mergePublicWithProdTimes", function(){
        var publicTimes = JSON.parse(grunt.file.read("dist/times.json"))
        var prodTimes = JSON.parse(grunt.file.read("database/times.json"))

        publicTimes.times.forEach(function(track){
            prodTimes.times.forEach(function(_track_, index){
                if(parseInt(track.id) == parseInt(_track_.id)){
                    prodTimes.times[index] = track
                }
            })
        })

        grunt.file.write("build/times.json", JSON.stringify(prodTimes, null, 2))
    })

    grunt.registerTask("clearTimes", function(){
        grunt.file.write("dist/times.json", "[]")
    })

    grunt.registerTask("convertOriginToDatabase", function(){
        var friendsJSON = JSON.parse(grunt.file.read("database/raw/origin/friends.json")),
            friendNames = [];

        friendsJSON.friends.forEach(function(friendData){
            if(friendData.state == "Friends") {
                friendNames.push(friendData.nameOnPlatform + ":" + friendData.pid)
            }
        });

        grunt.file.write("database/friends.json", JSON.stringify(friendNames, null, 2))

        //var tracksJSON = JSON.parse(grunt.file.read("database/raw/origin/tracks.json")),
        //    i18nEnJSON = JSON.parse(grunt.file.read("database/i18n/en.json")),
        //    mapTrackJSON = JSON.parse(stripJsonComments(grunt.file.read("database/tracks.json")));
        //
        //var trackArray = Object.keys(i18nEnJSON.tracks);
        //
        //tracksJSON.forEach(function(track){
        //    var trackName = track.name,
        //        oTrackId = track.id;
        //    // find right id in i18n via name
        //    trackArray.forEach(function(_trackId_){
        //        if(i18nEnJSON.tracks[_trackId_] == trackName){
        //            // add oid to map track
        //            mapTrackJSON.forEach(function(_track_){
        //                if(_trackId_ == _track_.id)
        //                    _track_.oid = oTrackId;
        //            })
        //        }
        //    })
        //});
    })

    grunt.registerTask("deploy", [
        "concat-json:database",
        "copy:i18nToDist",
        "copy:rawToDist",
        "concat:dist",
        "concat:vendor",
        "minjson:dist",
        "minjson:distI18n"
    ])

    grunt.registerTask("finalDeploy", [
        "deploy",
        "uglify:dist"
    ])

    grunt.registerTask("server", ["shell:python"])
}