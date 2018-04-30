module.exports = function (grunt, http, path, fs, fsExt) {
    return {
        makeWinPath: function (path_) {
            return path_.replace(/\//g, "\\");
        },
        ensureDirectoryExistence: function (filePath) {
            var dirname = path.dirname(filePath);
            if (fs.existsSync(dirname)) {
                return true;
            }
            this.ensureDirectoryExistence(dirname);
            fs.mkdirSync(dirname);
        },
        deleteFolderRecursive: function (path_) {
            var scope = this;
            if (fs.existsSync(path_)) {
                fs.readdirSync(path_).forEach(function (file) {
                    var curPath = path_ + "/" + file;
                    if (fs.statSync(curPath).isDirectory()) { // recurse
                        scope.deleteFolderRecursive(curPath);
                    } else { // delete file
                        //console.log("deleteFolderRecursive", curPath)
                        fs.unlinkSync(curPath);
                    }
                });
                //console.log("rmdirSync", path_)
                fs.rmdirSync(path_);
            }
        },
        downloadFile: function (url, pathDest, cb) {
            var http_or_https = http,
                scope = this;
            if (/^https:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(url)) {
                http_or_https = https;
            }
            http_or_https.get(url, function (response) {
                var headers = JSON.stringify(response.headers);
                switch (response.statusCode) {
                    case 200:
                        var file = fs.createWriteStream(pathDest);
                        response.on("data", function (chunk) {
                            file.write(chunk);
                        }).on("end", function () {
                            file.end();
                            cb(null);
                        });
                        break;
                    case 301:
                    case 302:
                    case 303:
                    case 307:
                        scope.downloadFile(response.headers.location, pathDest, cb);
                        break;
                    default:
                        cb(new Error("Server responded with status code " + response.statusCode));
                }

            })
                .on("error", function (err) {
                    cb(err);
                });
        },
        copyToolTo: function (from, to) {
            console.log("copyToolTo", from, to);
            if (fs.existsSync(from)) {
                var dirData = fs.readdirSync(from);
                for (var i in dirData) {
                    var dir = dirData[i];
                    if (!fs.existsSync(to + "/" + dir) || dir === "main.cpp") {
                        console.log("Copy: " + dir + " to " + to);
                        fsExt.copySync(from + "/" + dir, to + "/" + dir);
                    } else {
                        console.info("Exists already: " + dir + " to " + to);
                    }
                }
            }
        },
        values: function (obj, toLowerCase) {
            var vals = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    vals.push(toLowerCase ? obj[key].toLowerCase() : obj[key]);
                }
            }
            return vals;
        },
        createTask: function (importTask, importShared, callback) {
            grunt.registerTask(importTask.t, function () {
                if (callback) {
                    callback();
                }
                var done = importTask.a ? this.async() : null;
                if (importTask.json5) {
                    require("json5/lib/register");
                }
                //console.log("run " + importTask.t + " at " + importTask.p);
                require(importTask.p)(importShared, done);
            });
        },
        pad: function (n, width, z) {
            n = n + "";
            width = width || 2;
            z = z || "0";
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }
    }
};