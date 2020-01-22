module.exports = function (grunt, http, https, path, fs, fsExt) {
    let session = null;
    return {
        makeWinPath: function (path_) {
            return path_.replace(/\//g, "\\");
        },
        ensureDirectoryExistence: function (filePath) {
            const dirname = path.dirname(filePath);
            if (fs.existsSync(dirname)) {
                return true;
            }
            this.ensureDirectoryExistence(dirname);
            fs.mkdirSync(dirname);
        },
        deleteFolderRecursive: function (path_) {
            const scope = this;
            if (fs.existsSync(path_)) {
                fs.readdirSync(path_).forEach(function (file) {
                    const curPath = `${path_}/${file}`;
                    if (fs.statSync(curPath).isDirectory()) { // recurse
                        scope.deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(path_);
            }
        },
        downloadFile: function (url, pathDest, cb) {
            let http_or_https = http;
            const scope = this;
            if (/^https:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(url)) {
                http_or_https = https;
            }
            http_or_https.get(url, function (response) {
                const headers = JSON.stringify(response.headers);
                switch (response.statusCode) {
                    case 200:
                        const file = fs.createWriteStream(pathDest);
                        response
                            .on("data", function (chunk) {
                                file.write(chunk);
                            }).on("end", function () {
                                file.end();
                                setTimeout(() => {
                                    cb(pathDest);
                                }, 250);
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
                const dirData = fs.readdirSync(from);
                for (const i in dirData) {
                    const dir = dirData[i];
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
            const vals = [];
            for (const key in obj) {
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
                const done = importTask.a ? this.async() : null;
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
            const sessionFile = "build/upsession.json",
                options = this.getRequestOpts("/v1/profiles/sessions", "POST");

            session = fs.existsSync(sessionFile) ? require("../../" + sessionFile) : {expiration: null};

            const expireTime = new Date(session.expiration),
                now = new Date();

            if (session.expiration === null || expireTime <= now) {
                const req = https.request(options, function (res) {
                    res.on("data", function (data) {
                        const json = JSON.parse(data);
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
            //const auth = "Basic " + Buffer.from("email:pass").toString("base64");
            const auth = "Basic ZHV0c2NoZXJfc2JmQGhvdG1haWwuY29tOm1vY2xvdjEzMzc=";

            return {
                host: session === null ? "public-ubiservices.ubi.com" : "lb-rdv-http.ubi.com",
                port: 443,
                path: path,
                method: method ? method : "GET",
                headers: {
                    "Ubi-AppId": appId ? appId : this.appId,
                    "Authorization": session === null ? auth : "Ubi_v1 t=" + session.ticket,
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
        },
        capitalizeFirstLetter: (string) => {
            return string && (string.charAt(0).toUpperCase() + string.slice(1));
        },
        print: (obj) => {
            return JSON.stringify(obj, null, 2);
        },
        getTrackIdViaName: (trackName, getOid, printOutNames) => {
            const fileData = fs.readFileSync("database/trackdata/ids.json", "utf8");
            const trackData = fileData.split("// ");
            const regexpOid = new RegExp(/"oid": (\d+),/, "g");
            const regexpId = new RegExp(/"id": (\d+),/, "g");
            let trackId = -1;

            const foundData = trackData.filter(strWithTrackData => {
                const isTrack = strWithTrackData.indexOf("oid") !== -1;
                const isTrackData = isTrack && strWithTrackData.indexOf(trackName) !== -1;

                if (isTrack && isTrackData) {
                    if (getOid) {
                        const matches = regexpOid.exec(strWithTrackData);
                        if (matches !== null) {
                            trackId = matches[1];
                        }
                    } else {
                        const matches = regexpId.exec(strWithTrackData);
                        if (matches !== null) {
                            trackId = matches[1];
                        }
                    }
                }

                if (isTrack && printOutNames) {
                    console.log(name, "=>", strWithTrackData);
                }

                return trackId !== -1;
            });

            return parseInt(trackId);
        },
        getBikeIdViaName: (name, printOutNames) => {
            const data = require("../../database/media/bikes.json"),
                bikesData = data.bikes,
                bikes = Object.keys(bikesData);
            const foundData = bikes.filter(bikeId => {
                const bikeData = bikesData[bikeId];
                if (printOutNames) {
                    console.log(name, "=>", bikeId,
                        bikeData.name,
                        bikeData.nameShort ? "/ " + bikeData.nameShort : "");
                }
                const isShortName = ("nameShort" in bikeData)
                    ? bikeData.nameShort === name
                    : false;
                const isNormalName = bikeData.name === name;
                return isShortName || isNormalName;
            });

            if (foundData.length === 1) {
                return parseInt(foundData[0]);
            }
            return -1;
        },
        handleDevice: function (isIos) {
            return isIos ? "IOS" : "ANDROID";
        },
        hD: function (isIos) {
            return isIos ? "IP" : "AN";
        },
        getDeviceName: function (isiOS) {
            return `TRIAG_${this.hD(isiOS)}_LNCH_A`;
        },
        vars: {},
        setVars: function (key, value) {
            this.vars[key] = value;
        },
        writeResultsDown: function (isIos) {
            const scope = this;
            // read all server requests parallel
            return new Promise((resolve, reject) => {
                scope.readFromServer(1, isIos).then(data => {
                    const fileName = `${scope.vars.weekId}.${scope.vars.trackId}.${data.device}`,
                        itFile = `${scope.vars.pathArchive}${fileName}.json`,
                        startFile = `${scope.vars.pathArchive}${fileName}.START.json`;
                    // save server request
                    fs.writeFileSync(itFile, JSON.stringify(data.results, null, 2));
                    // read previous data request
                    if (!fs.existsSync(startFile)) {
                        fs.writeFileSync(startFile, JSON.stringify(data.results, null, 2));
                    }
                    resolve();
                }, (...error) => {
                    console.log("kaputt")
                    reject({
                        msg: "writeResultsDown.error",
                        error,
                    });
                });
            });
        },
        readFromServer: function (offset, readiOS) {
            const scope = this;
            return new Promise((resolve, reject) => {
                console.log(`readFromServer.TEST 1 PULL OF ${offset} REQUESTS OF ${scope.handleDevice(readiOS)}`);
                scope.doRequest(offset, readiOS).then(() => {
                    // on success do all requests
                    const promises = [];

                    for (offset; offset <= (scope.vars.maxLimit / scope.vars.rankLimit); offset++) {
                        promises.push(scope.doRequest(offset, readiOS));
                    }

                    console.log(`readFromServer.WAITING OF ${offset - 1} REQUESTS FOR ${scope.handleDevice(readiOS)}`);
                    // merge all to one array
                    Promise.all(promises).then((...arguments) => {
                        let results = [],
                            device = "";

                        [].forEach.call(arguments[0], (result) => {
                            results = results.concat(result.results);
                            device = result.device;
                        });

                        resolve({
                            results,
                            device
                        });
                    });
                }, (...error) => {
                    reject({
                        msg: "readFromServer.error",
                        error,
                    });
                });
            });
        },
        doRequest: function (offset, readiOS) {
            const scope = this;
            return new Promise((resolve, reject) => {
                const limit = offset * scope.vars.rankLimit,
                    device = scope.getDeviceName(readiOS),
                    range = `${limit - 99},${scope.vars.rankLimit}`,
                    options = scope.getRequestOpts(
                        `/${device}/public/` +
                        `playerstats/v1/ranking/track${scope.vars.trackId}?range=${range}`,
                    );

                if (scope.vars.debug) {
                    console.log(options.path);
                }

                let body = "";
                const badGateway = false;

                // do request
                const req = https.request(options, res => {
                    res.setEncoding("utf8");
                    res.on("data", chunk => {
                        body += chunk;
                    }).on("end", () => {
                        if (body.indexOf("Bad Gateway") !== -1) {
                            reject({
                                msg: `doRequest.Bad Gateway for ${scope.hD(readiOS)}`,
                                body,
                                options,
                            });
                        } else {
                            if (scope.isJson(body)) {
                                resolve({
                                    results: JSON.parse(body).results,
                                    device,
                                });
                            } else {
                                reject({
                                    msg: `doRequest.No JSON for ${scope.hD(readiOS)}`,
                                    body,
                                    options,
                                });
                            }
                        }
                    });
                });

                req.on("error", error => {
                    console.error({
                        msg: `doRequest.PULL ERROR for ${scope.hD(readiOS)}`,
                        error,
                        body,
                        options,
                    });
                    // try again
                    scope.readFromServer(offset, readiOS).then(data => {
                        resolve({
                            results: data.results,
                            device,
                        });
                    });
                });

                req.end();
            });
        },
        doRequestGetPlayerRank: function (playerId, readiOS) {
            const scope = this;
            return new Promise((resolve, reject) => {
                const deviceServer = scope.getDeviceName(readiOS),
                    options = scope.getRequestOpts(
                        `/${deviceServer}/public/` +
                        //`playerprogress/v1/progress/status?profileid=${playerId}`
                        /*{ server_time: 1571221064,
                            player_level: 53,
                            missions_completed: 475,
                            coins: 16547214,
                            player_points: 14344342,
                            diamonds: 1774 } */
                        //`playerstats/v1/ranking/global_stats?around=${playerId},1`
                        `playerstats/v1/ranking/global_stats_donkey?around=${playerId},1`
                        //`playerstats/v1/ranking/global_stats_crazy?around=${playerId},1`
                    );

                if (scope.vars.debug) {
                    console.log(options.path);
                }

                let body = "";
                const badGateway = false;

                // do request
                const req = https.request(options, res => {
                    res.setEncoding("utf8");
                    res.on("data", function (chunk) {
                        body += chunk;
                    }).on("end", function () {
                        if (body.indexOf("Bad Gateway") !== -1) {
                            reject({
                                msg: `doRequestGetPlayerRank.Bad Gateway for ${scope.hD(readiOS)}`,
                                body,
                                options,
                            });
                        } else {
                            if (scope.isJson(body)) {
                                const json = JSON.parse(body);
                                resolve({
                                    rank: json.results[0].rank,
                                    result:  json.results[0],
                                    data: scope.encodeLeaderboardData(
                                        // submittime, score, time, data, upgrades
                                        json.results[0].stats.submittime,
                                        json.results[0].stats.global_score,
                                        json.results[0].stats.drivetime,
                                        json.results[0].stats.data,
                                        json.results[0].stats.upgrades,
                                    )
                                });
                            } else {
                                reject({
                                    msg: `doRequestGetPlayerRank.No JSON for ${scope.hD(readiOS)}`,
                                    body,
                                    options,
                                });
                            }
                        }
                    });
                });

                req.on("error", error => {
                    resolve({
                        msg: `doRequestGetPlayerRank.PULL ERROR for ${scope.hD(readiOS)}`,
                        error,
                        body,
                        options,
                    });
                });

                req.end();
            });
        },
        uint16: function (n) {
            return n & 0xFFFF;
        },
        encodeLeaderboardData: function (submittime, score, time, data, upgrades) {
            return {
                faults: ((360000000 - score) - time) / 3600000,
                bikeId: (data >>> 8) & 0x3F,
                paintJobId: (submittime & 0xF),// submitTime2
                //submitTime3: (submittime >>> 4),
                //submitTime1: (submittime >>> 12),
                riderLevel: (this.uint16(upgrades) >>> 6) + 1,
                costum: {
                    headId: ((data >> 26) & 0x3F) + ((submittime >> 12) ? 64 : 0),
                    bodyId: ((data >> 20) & 0x3F) + ((submittime >> 14) ? 64 : 0),
                    pantsId: ((data >> 14) & 0x3F) + ((submittime >> 16) ? 64 : 0)
                },
                upgrades: {
                    bar: (upgrades >>> 28),
                    engine: (upgrades >>> 24) & 0xF,
                    wheels: (upgrades >>> 20) & 0xF,
                    frame: (upgrades >>> 16) & 0xF
                }
            };
        },
        findImprovement: function (dataStart, timeNow, playerId) {
            let improveTime = 0;
            if (dataStart) {
                dataStart.map((score) => {
                    if (!score) {
                        console.error(dataStart, timeNow, playerId)
                    }

                    if (("player" in score)
                        && score.player === playerId) {
                        improveTime = score.stats.drivetime - timeNow;
                    }
                });
            }
            return improveTime;
        },
        toTitleCase: function(phrase){
            return phrase
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
    };
};