module.exports = function (shared, done) {
    console.log("# DANS TEAMS");
    var rankLimit = 100,
        maxLimit = 2000,
        pathRequest = "build/danteam/",
        pathArchive = pathRequest + "archive/",
        teams = [],
        settings = require("./11.danTeam.settings"),
        trackId = settings.week[0].trackId,
        bikeId = settings.week[0].bikeId;
    // set best player
    settings.allPlayer = [];
    settings.maxLimit = maxLimit;

    teams = Object.keys(settings.teams);

    shared.ensureDirectoryExistence(pathRequest + "json.json");

    function handleDevice(isIos) {
        return isIos ? "IOS" : "ANDROID";
    }

    function readFromServer(offset, readiOS) {
        var promises = [];
        for (offset; offset <= (maxLimit / rankLimit); offset++) {
            promises.push(new Promise(function (resolve) {
                var limit = offset * rankLimit,
                    device = "TRIAG_" + (readiOS ? "IP" : "AN") + "_LNCH_A",
                    range = (limit - 99) + "," + (rankLimit),
                    options = shared.getRequestOpts(
                        "/" + device +
                        "/public/playerstats/v1/ranking/track" + trackId +
                        "?range=" + range
                        //"?around=" + range
                    );
                // do request
                var req = shared.https.request(options, function (res) {
                    var body = "";
                    res.setEncoding("utf8");
                    res.on("data", function (chunk) {
                        body += chunk;
                    }).on("end", function () {
                        resolve({
                            results: JSON.parse(body).results,
                            device: device
                        });
                    });
                });

                req.on("error", function (e) {
                    console.error("pull error", offset, e);
                    readFromServer(offset, readiOS).then(function (data) {
                        resolve({
                            results: data.results,
                            device: device
                        });
                    });
                });

                req.end();
            }));
        }
        console.log("WAITING FOR PULLING OF", offset, "REQUESTS OF", handleDevice(readiOS));
        // merge all to one array
        return Promise.all(promises).then(function () {
            var results = [],
                device = "";

            [].forEach.call(arguments[0], function (result) {
                results = results.concat(result.results);
                device = result.device;
            });

            return {
                results: results,
                device: device
            };
        });
    }

    function writeResultsDown(isIos) {
        // read all android parallel
        return new Promise(function (resolve) {
            readFromServer(1, isIos).then(function (data) {
                var fileName = trackId + "." + data.device,
                    startFile = fileName + ".START.json",
                    resultsStart = [];

                // save server request
                shared.fs.writeFileSync(pathArchive + fileName + ".json",
                    JSON.stringify(data.results, null, 2));
                // read previous data request
                if (shared.fs.existsSync(pathArchive + startFile)) {
                    resultsStart = require("../../" + pathArchive + startFile);
                }

                evaluateResults(data.results, resultsStart, isIos);
                resolve();
            });
        });
    }

    function evaluateResults(data, dataStart, isIos) {
        console.log("EVALUATE", data.length, handleDevice(isIos), "RESULTS");
        var teamScore = data.filter(function (score) {
            var found = {};
            var foundItem = teams.find(function (team) {
                found = settings.teams[team].find(function (player) {
                    return ("player" in score)
                        && shared._.startsWith(player.id, score.player)
                        && !("time" in player);
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
        var improveTime = 0;
        if (dataStart) {
            dataStart.filter(function (score) {
                if (score.player === playerId) {
                    improveTime = score.stats.drivetime - timeNow;
                }
            });
        }
        return improveTime;
    }

    function getData(submittime, score, time, data, upgrades) {
        return {
            faults: ((360000000 - score) - time) / 3600000,
            bikeID: (data >>> 8) & 0x3F,
            paintJobID: (submittime & 0xF),
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
            },
            // submitTime1: (submittime >>> 12),
            // submitTime3: (submittime >>> 4),
            // upgrade5: (upgrades >>> 6)
        }
    }

    function printResults() {
        var teamTimes = [],
            allPlayer = [];

        teams.map(function (team) {
            var timesInt = 0,
                player = 0;
            // add all player to one array
            allPlayer = allPlayer.concat(settings.teams[team]);
            // order best to badest
            settings.teams[team] = shared._.sortBy(settings.teams[team], ["time"]);
            // fill times in team
            settings.teams[team].map(function (p) {
                var hasTime = ("time" in p);
                var driveBike = ("bike" in p && p.bike);
                if (hasTime) {
                    timesInt += p.time;
                    player++;
                }
            });

            teamTimes.push({name: team, times: timesInt, player: player});
        });
        // sort all player
        settings.allPlayer = shared._.sortBy(allPlayer, ["time"]).map(function (player) {
            return {time: player.time, name: player.up, isIos: player.isIos};
        });
        // order teams
        var timesWith6 = teamTimes.filter(function (team) {
                return team.player === 6;
            }),
            timesWithout6 = teamTimes.filter(function (team) {
                return team.player !== 6;
            }),
            prevTeam = null;
        // order teams and add difftime to prev
        teamTimes = shared._.sortBy(timesWith6, ["times"])
            .map(function (team) {
                if (prevTeam !== null) {
                    team.diffTime = team.times - prevTeam.times;
                } else {
                    team.diffTime = 0;
                }
                prevTeam = team;
                return team;
            })
            .concat(
                shared._.sortBy(timesWithout6, ["player", "times"])
                    .reverse()
            );
        console.log("team times wrote to: " + pathRequest);
        //console.log(JSON.stringify(times, null, 2));
        shared.fs.writeFileSync(pathRequest + "teams.json", JSON.stringify(settings, null, 2));
        shared.fs.writeFileSync(pathRequest + "teamTimes.json", JSON.stringify(teamTimes, null, 2));
        console.log("# DAN TEAMS END");
    }

    shared.getUbisoftTicket(function () {
        var promises = [];
        // start android
        promises.push(writeResultsDown());
        // start ios
        promises.push(writeResultsDown(true));
        // wait for all
        Promise.all(promises).then(function () {
            // print
            console.log("All server data is in da house");
            printResults();
            //
            shared.grunt.task.run([
                "deployDanTeam"
            ]);
            done();
        });
    });
};