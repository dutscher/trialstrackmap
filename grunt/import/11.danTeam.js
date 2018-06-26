module.exports = function (shared, done) {
    console.log("# DANS TEAMS");
    var debug = false,
        rankLimit = 100,
        maxLimit = 2000,
        pathRequest = "build/danteam/",
        pathArchive = `${pathRequest}archive/`,
        teams = [],
        settings = require("./11.danTeam.settings"),
        weekId = settings.week[0].id,
        trackId = settings.week[0].trackId,
        bikeId = settings.week[0].bikeId;

    console.log(`# weekId: ${weekId} - trackId: ${trackId}/${settings.week[0].trackName} - bikeId: ${bikeId}/${settings.week[0].bike}`);

    if (debug) {
        maxLimit = 100;
        console.log("-----------------");
        console.log("!!!!debug = true", maxLimit, "!!!!");
        console.log("-----------------");
    }

    // set best player
    settings.allPlayer = [];
    settings.maxLimit = maxLimit;

    teams = Object.keys(settings.teams);

    shared.ensureDirectoryExistence(`${pathRequest}json.json`);
    shared.ensureDirectoryExistence(`${pathArchive}json.json`);

    function handleDevice(isIos) {
        return isIos ? "IOS" : "ANDROID";
    }

    function getDeviceName(isiOS) {
        return `TRIAG_${(isiOS ? "IP" : "AN")}_LNCH_A`;
    }

    function doRequest(offset, readiOS) {
        return new Promise((resolve, reject) => {
            var limit = offset * rankLimit,
                device = getDeviceName(readiOS),
                range = (limit - 99) + "," + (rankLimit),
                options = shared.getRequestOpts(
                    "/" + device +
                    "/public/playerstats/v1/ranking/track" + trackId +
                    "?range=" + range
                    //"?around=" + range
                );

            if (debug) {
                console.log(options.path);
            }

            // do request
            var req = shared.https.request(options, (res) => {
                var body = "",
                    badGateway = false;
                res.setEncoding("utf8");
                res.on("data", function (chunk) {
                    body += chunk;
                }).on("end", function () {
                    if (body.indexOf("Bad Gateway") !== -1) {
                        reject({
                            msg: `Bad Gateway for ${(readiOS ? "IP" : "AN")}`,
                            body,
                            options,
                        });
                    } else {
                        if (shared.isJson(body)) {
                            resolve({
                                results: JSON.parse(body).results,
                                device,
                            });
                        } else {
                            reject({
                                msg: `No JSON for ${(readiOS ? "IP" : "AN")}`,
                                body,
                                options,
                            });
                        }
                    }
                });
            });

            req.on("error", (error) => {
                console.error({
                    msg: `PULL ERROR for ${(readiOS ? "IP" : "AN")}`,
                    error,
                    body,
                    options: options,
                });
                // try again
                readFromServer(offset, readiOS).then(function (data) {
                    resolve({
                        results: data.results,
                        device
                    });
                });
            });

            req.end();
        });
    }

    function readFromServer(offset, readiOS) {
        return new Promise((resolve, reject) => {

            console.log(`TEST 1 PULL OF ${offset} REQUESTS OF ${handleDevice(readiOS)}`);
            doRequest(offset, readiOS).then(() => {
                // on success do all requests
                var promises = [];

                for (offset; offset <= (maxLimit / rankLimit); offset++) {
                    promises.push(doRequest(offset, readiOS));
                }

                console.log(`WAITING FOR PULLING OF ${offset - 1} REQUESTS OF ${handleDevice(readiOS)}`);
                // merge all to one array
                Promise.all(promises).then((...arguments) => {
                    var results = [],
                        device = "";

                    [].forEach.call(arguments[0], (result) => {
                        results = results.concat(result.results);
                        device = result.device;
                    });

                    resolve({
                        results: results,
                        device: device
                    });
                });
            }, (...error) => {
                reject({
                    msg: "readFromServer error",
                    error,
                });
            });
        });
    }

    function writeResultsDown(isIos) {
        // read all android parallel
        return new Promise((resolve, reject) => {
            readFromServer(1, isIos).then((data) => {
                const fileName = `${weekId}.${trackId}.${data.device}`,
                    itFile = `${pathArchive}${fileName}.json`,
                    startFile = `${pathArchive}${fileName}.START.json`;

                // save server request
                shared.fs.writeFileSync(itFile, JSON.stringify(data.results, null, 2));
                // read previous data request
                if (!shared.fs.existsSync(startFile)) {
                    shared.fs.writeFileSync(startFile, JSON.stringify(data.results, null, 2));
                }
                resolve();
            }, (...error) => {
                reject({
                    msg: "writeResultsDown error",
                    error,
                });
            });
        });
    }

    function readResults(isIos) {
        return new Promise((resolve) => {
            const device = getDeviceName(isIos),
                fileName = `${weekId}.${trackId}.${device}`,
                itFile = `${pathArchive}${fileName}.json`,
                startFile = `${pathArchive}${fileName}.START.json`;
            let results = [];
            if (shared.fs.existsSync(itFile)) {
                results = require(`../../${itFile}`);
            }
            let resultsStart = [];
            if (shared.fs.existsSync(startFile)) {
                resultsStart = require(`../../${startFile}`);
            }
            evaluateResults(results, resultsStart, isIos);
            resolve();
        });
    }

    function evaluateResults(data, dataStart, isIos) {
        console.log("EVALUATE", data.length, handleDevice(isIos), "RESULTS");
        var teamScore = data.filter((score) => {
            var found = {},
                foundItem = teams.find((team) => {
                    found = settings.teams[team].find((player) => {
                        return score
                            && ("player" in score)
                            && shared._.startsWith(player.id, score.player)
                            && (
                                (isIos && shared._.endsWith(player.id, "-1")) // ios
                                ||
                                (!isIos) // android
                            );
                    });
                    return found;
                }) !== undefined;
            if (foundItem) {
                found.isIos = isIos === true;
                found.rank = score.rank;
                found.time = score.stats.drivetime;

                var data = getData(
                    score.stats.submittime,
                    score.stats.score_value,
                    found.time,
                    score.stats.data,
                    score.stats.upgrades);
                found.drivenBike = data.bikeID === bikeId;
                found.improvement = findImprovement(dataStart, found.time, score.player);
                found.data = data;
            } else {
                found = {time: 99999};
            }
            return foundItem;
        });
    }

    function findImprovement(dataStart, timeNow, playerId) {
        let improveTime = 0;
        if (dataStart) {
            dataStart.filter((score) => {
                if (score.player === playerId) {
                    improveTime = score.stats.drivetime - timeNow;
                }
            });
        }
        return improveTime;
    }

    function uint16(n) {
        return n & 0xFFFF;
    }

    function getData(submittime, score, time, data, upgrades) {
        return {
            faults: ((360000000 - score) - time) / 3600000,
            bikeID: (data >>> 8) & 0x3F,
            //submitTime1: (submittime >>> 12),
            paintJobID: (submittime & 0xF),// submitTime2
            //submitTime3: (submittime >>> 4),
            riderLevel: (uint16(upgrades) >>> 6) + 1,
            costum: {
                headID: (data >>> 26),
                torsoID: (data >>> 20) & 0x3F,
                legID: (data >>> 14) & 0x3F
            },
            upgrades: {
                bar: (upgrades >>> 28),
                engine: (upgrades >>> 24) & 0xF,
                wheels: (upgrades >>> 20) & 0xF,
                frame: (upgrades >>> 16) & 0xF
            }
        };
    }

    function printResults() {
        var teamTimes = [],
            allPlayer = [];

        teams.map((team) => {
            var timesInt = 0,
                player = 0;
            // add all player to one array
            allPlayer = allPlayer.concat(settings.teams[team]);
            // order best to badest
            settings.teams[team] = shared._.sortBy(settings.teams[team], ["time"]);
            // fill times in team
            settings.teams[team].map((p) => {
                var hasTime = ("time" in p),
                    driveBike = ("bike" in p && p.bike);
                if (hasTime) {
                    timesInt += p.time;
                    player++;
                }
            });

            teamTimes.push({name: team, times: timesInt, player: player, ratio: timesInt / player});
        });
        // sort all player
        settings.allPlayer = shared._.sortBy(allPlayer, ["time"]).map((player) => {
            return {time: player.time, name: player.up, isIos: player.isIos};
        });
        // order teams
        let prevTeam = null;
        // order teams and add difftime to prev
        teamTimes = shared._.sortBy(teamTimes, ["ratio"])
            .map((team) => {
                if (prevTeam !== null) {
                    team.diffTime = team.times - prevTeam.times;
                } else {
                    team.diffTime = 0;
                }
                prevTeam = team;
                return team;
            });
        console.log("team times wrote to: " + pathRequest);
        //console.log(JSON.stringify(times, null, 2));
        shared.fs.writeFileSync(pathRequest + "teams.json", JSON.stringify(settings, null, 2));
        shared.fs.writeFileSync(pathRequest + "teamTimes.json", JSON.stringify(teamTimes, null, 2));
        console.log("# DAN TEAMS END");
    }

    function pullAndDeploy() {
        shared.getUbisoftTicket(() => {
            const promises = [];
            // start android
            promises.push(writeResultsDown().then(() => {
                return readResults();
            }));
            // start ios
            promises.push(writeResultsDown(true).then(() => {
                return readResults(true);
            }));
            // wait for all
            Promise.all(promises).then(() => {
                // print
                console.log("All server data is in da house");
                printResults();
                done();
            }, (...error) => {
                console.error("Promise.all", JSON.stringify(error, null, 2));
                console.log("Not all server data is in da house");
                printResults();
                done();
            });
        });
    }

    function onlyReadAndDeploy() {
        const promises = [];
        // start android
        promises.push(readResults());
        // start ios
        promises.push(readResults(true));

        Promise.all(promises).then(() => {
            // print
            console.log("All server data readed from files");
            printResults();
            done();
        });
    }

    // switch
    if (process.env.fullPull) {
        pullAndDeploy();
    } else if (process.env.onlyRead) {
        onlyReadAndDeploy();
    } else {
        done();
    }
};