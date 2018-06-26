module.exports = function (grunt, http, https, path, fs, fsExt) {
    var session = null;
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
        },
        getUbisoftTicket: function (callback) {
            var sessionFile = "build/upsession.json",
                options = this.getRequestOpts("/v1/profiles/sessions", "POST");

                session = fs.existsSync(sessionFile) ? require("../../" + sessionFile) : {expiration: null};

            var expireTime = new Date(session.expiration),
                now = new Date();

            if (session.expiration === null || expireTime <= now) {
                var req = https.request(options, function (res) {
                    res.on("data", function (data) {
                        var json = JSON.parse(data);
                        session = {
                            ticket: json.ticket,
                            expiration: json.expiration,
                            serverTime: json.serverTime
                        };
                        // write session file
                        fs.writeFileSync(sessionFile, JSON.stringify(session));
                        console.log("wrote session file");
                        // go ahead
                        callback();
                    });
                });

                req.on("error", function (e) {
                    console.error(e);
                    done();
                });

                req.end();
            } else {
                console.log("session file is still valid");
                callback();
            }
        },
        getRequestOpts: function (path, method, appId) {
            return {
                host: session === null ? "public-ubiservices.ubi.com" : "lb-rdv-http.ubi.com",
                port: 443,
                path: path,
                method: method ? method : "GET",
                headers: {
                    "Ubi-AppId": appId ? appId : this.appId,
                    //"Authorization": "Basic " + Buffer.from("email:pass").toString("base64"),
                    "Authorization": session === null ? "Basic ZHV0c2NoZXJfc2JmQGhvdG1haWwuY29tOm1vY2xvdjEzMzc=" : "Ubi_v1 t=" + session.ticket,
                    "Content-Type": "application/json"
                }
            };
        },
        isJson: (str) => {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }
    };
};