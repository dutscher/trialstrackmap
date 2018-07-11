module.exports = function (shared, done) {
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
    settings.teamRatio = {
        blue: {sum: 0, count: 0},
        red: {sum: 0, count: 0}
    };
    settings.maxLimit = maxLimit;

    teams = Object.keys(settings.teams);

    shared.ensureDirectoryExistence(`${pathRequest}json.json`);
    shared.ensureDirectoryExistence(`${pathArchive}json.json`);

    // SERVER

    function handleDevice(isIos) {
        return isIos ? "IOS" : "ANDROID";
    }

    function getDeviceName(isiOS) {
        return `TRIAG_${(isiOS ? "IP" : "AN")}_LNCH_A`;
    }

    function writeResultsDown(isIos) {
        // read all server requests parallel
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
                    msg: "writeResultsDown.error",
                    error,
                });
            });
        });
    }

    function readFromServer(offset, readiOS) {
        return new Promise((resolve, reject) => {
            console.log(`readFromServer.TEST 1 PULL OF ${offset} REQUESTS OF ${handleDevice(readiOS)}`);
            doRequest(offset, readiOS).then(() => {
                // on success do all requests
                const promises = [];

                for (offset; offset <= (maxLimit / rankLimit); offset++) {
                    promises.push(doRequest(offset, readiOS));
                }

                console.log(`readFromServer.WAITING OF ${offset - 1} REQUESTS FOR ${handleDevice(readiOS)}`);
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
    }

    function doRequest(offset, readiOS) {
        return new Promise((resolve, reject) => {
            const limit = offset * rankLimit,
                device = getDeviceName(readiOS),
                range = `${limit - 99},${rankLimit}`,
                options = shared.getRequestOpts(
                    `/${device}/public/` +
                    `playerstats/v1/ranking/track${trackId}?range=${range}`,
                );

            if (debug) {
                console.log(options.path);
            }

            let body = "";
            const badGateway = false;

            // do request
            const req = shared.https.request(options, res => {
                res.setEncoding("utf8");
                res.on("data", chunk => {
                    body += chunk;
                }).on("end", () => {
                    if (body.indexOf("Bad Gateway") !== -1) {
                        reject({
                            msg: `doRequest.Bad Gateway for ${readiOS ? "IP" : "AN"}`,
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
                                msg: `doRequest.No JSON for ${readiOS ? "IP" : "AN"}`,
                                body,
                                options,
                            });
                        }
                    }
                });
            });

            req.on("error", error => {
                console.error({
                    msg: `doRequest.PULL ERROR for ${readiOS ? "IP" : "AN"}`,
                    error,
                    body,
                    options,
                });
                // try again
                readFromServer(offset, readiOS).then(data => {
                    resolve({
                        results: data.results,
                        device,
                    });
                });
            });

            req.end();
        });
    }

    function doRequestGetPlayerRank(playerId, readiOS) {
        return new Promise((resolve, reject) => {
            const deviceServer = getDeviceName(readiOS),
                options = shared.getRequestOpts(
                    `/${deviceServer}/public/` +
                    //`playerprogress/v1/progress/status?profileid=${playerId}`
                    `playerstats/v1/ranking/global_stats?around=${playerId},1`
                );

            if (debug) {
                console.log(options.path);
            }

            let body = "";
            const badGateway = false;

            // do request
            const req = shared.https.request(options, res => {
                res.setEncoding("utf8");
                res.on("data", function (chunk) {
                    body += chunk;
                }).on("end", function () {
                    if (body.indexOf("Bad Gateway") !== -1) {
                        reject({
                            msg: `doRequestGetPlayerRank.Bad Gateway for ${(readiOS ? "IP" : "AN")}`,
                            body,
                            options,
                        });
                    } else {
                        if (shared.isJson(body)) {
                            resolve({
                                rank: JSON.parse(body).results[0].rank,
                            });
                        } else {
                            reject({
                                msg: `doRequestGetPlayerRank.No JSON for ${(readiOS ? "IP" : "AN")}`,
                                body,
                                options,
                            });
                        }
                    }
                });
            });

            req.on("error", error => {
                resolve({
                    msg: `doRequestGetPlayerRank.PULL ERROR for ${(readiOS ? "IP" : "AN")}`,
                    error,
                    body,
                    options,
                });
            });

            req.end();
        });
    }

    // CALC & SORT

    function uint16(n) {
        return n & 0xFFFF;
    }

    function readResults(isIos) {
        return new Promise((resolve) => {
            const device = getDeviceName(isIos),
                fileName = `${weekId}.${trackId}.${device}`,
                itFile = `${pathArchive}${fileName}.json`,
                startFile = `${pathArchive}${fileName}.START.json`,
                ranksFile = `${pathRequest}ranks.json`;
            let results = [];
            if (shared.fs.existsSync(itFile)) {
                results = require(`../../${itFile}`);
            }
            let resultsStart = [];
            if (shared.fs.existsSync(startFile)) {
                resultsStart = require(`../../${startFile}`);
            }
            let ranks = {};
            if (shared.fs.existsSync(ranksFile)) {
                ranks = require(`../../${ranksFile}`);
            }
            evaluateResults(results, resultsStart, ranks, isIos);
            resolve();
        });
    }

    function evaluateResults(data, dataStart, dataRanks, isIos) {
        console.log(`evaluateResults.${handleDevice(isIos)} / length: ${data.length}`);
        try {
            data.map((score) => {
                let found = {},
                    foundItem = teams.find((team) => {
                        found = settings.teams[team].find((player) => {
                            return score
                                && ("player" in score)
                                && shared._.startsWith(player.id, score.player)
                                && (
                                    (isIos && shared._.endsWith(player.id, `-${settings.platform.ios}`))
                                    ||
                                    (!isIos) // android
                                );
                        });
                        return found;
                    }) !== undefined;
                if (foundItem) {
                    found.isIos = isIos === true;
                    found.globalRank = (found.id in dataRanks) ? dataRanks[found.id] : -1;
                    found.rank = score.rank;
                    found.time = score.stats.drivetime;
                    const data = getData(
                        score.stats.submittime,
                        score.stats.score_value,
                        found.time,
                        score.stats.data,
                        score.stats.upgrades
                    );
                    found.data = data;
                    found.drivenBike = data.bikeId === bikeId;
                    found.improvement = findImprovement(dataStart, found.time, score.player);
                } else {
                    found = {
                        isIos: isIos === true,
                        time: -1,
                        rank: -1
                    };
                }

                found.hasTime = ("time" in found);
                found.hasImprovement = ("improvement" in found) && found.improvement > 0;
                found.hasDrivenBike = ("drivenBike" in found) && found.drivenBike;

                return foundItem;
            });
        } catch (e) {
            console.error("evaluateResults.error", e);
        }
    }

    function findImprovement(dataStart, timeNow, playerId) {
        let improveTime = 0;
        if (dataStart) {
            dataStart.map((score) => {
                if (("player" in score)
                    && score.player === playerId) {
                    improveTime = score.stats.drivetime - timeNow;
                }
            });
        }
        return improveTime;
    }

    function getData(submittime, score, time, data, upgrades) {
        return {
            faults: ((360000000 - score) - time) / 3600000,
            bikeId: (data >>> 8) & 0x3F,
            //submitTime1: (submittime >>> 12),
            paintJobId: (submittime & 0xF),// submitTime2
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
        let teamTimes = [],
            allImprovedPlayer = [],
            allNoneImprovePlayer = [];
        // iterate all teams
        teams.map((team) => {
            let timesInt = 0,
                teamPlayer = 0,
                ratio = 0;
            // order best to badest
            settings.teams[team] = shared._.sortBy(settings.teams[team], ["time"]);
            // fill times in team
            settings.teams[team].map((player) => {
                if (player.hasTime && player.hasImprovement && player.hasDrivenBike) {
                    timesInt += player.time;
                    teamPlayer++;
                    // add to
                    allImprovedPlayer.push(player);
                } else {
                    allNoneImprovePlayer.push(player);
                }
            });
            // only impromentTimes and improved player times counts
            ratio = timesInt / teamPlayer;
            if (timesInt) {
                if (settings.colors.blue.indexOf(team) !== -1) {
                    settings.teamRatio.blue.sum += ratio;
                    settings.teamRatio.blue.count++;
                } else {
                    settings.teamRatio.red.sum += ratio;
                    settings.teamRatio.red.count++;
                }
            }

            teamTimes.push({name: team, times: timesInt, teamPlayer: teamPlayer, ratio: Math.round(ratio)});
        });

        // sort all player
        allImprovedPlayer = shared._.sortBy(allImprovedPlayer, ["time"]);
        allNoneImprovePlayer = shared._.sortBy(allNoneImprovePlayer, ["time"]);

        settings.allPlayer = allImprovedPlayer.concat(allNoneImprovePlayer).map((player) => {
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


        console.log("printResults.team times wrote to: " + pathRequest);
        //console.log(JSON.stringify(times, null, 2));
        shared.fs.writeFileSync(pathRequest + "teams.json", JSON.stringify(settings, null, 2));
        shared.fs.writeFileSync(pathRequest + "teamTimes.json", JSON.stringify(teamTimes, null, 2));
        console.log("# DAN TEAMS END");
    }

    // DEPLOY

    function getAllPlayerRanks() {
        const requests = [],
            memberRanks = {};
        teams.find((teamName) => {
            const teamMembers = settings.teams[teamName];
            teamMembers.find((teamMember) => {
                const isiOS = shared._.endsWith(teamMember.id, `-${settings.platform.ios}`),
                    clearMemberId = teamMember.id.replace(/(-1|-2)$/, "");


                requests.push({
                    memberId: teamMember.id,
                    clearMemberId,
                    isiOS,
                });
            });
        });
        console.log("getAllPlayerRanks for", requests.length, "members");

        function doRequestsForMember(member) {
            return doRequestGetPlayerRank(member.clearMemberId, member.isiOS).then((result) => {
                memberRanks[member.memberId] = ("error" in result) ? 0 : result.rank;
                return true;
            });
        }

        let requestsDone = 0;

        function repeatRequest() {
            return doRequestsForMember(requests[requestsDone]).then(() => {
                requestsDone++;
                console.log("requestsDone", requestsDone, requests.length);
                if (requestsDone !== requests.length) {
                    return repeatRequest();
                }
            });
        }

        return new Promise((resolve) => {
            repeatRequest().then(() => {
                shared.fs.writeFileSync(pathRequest + "ranks.json", JSON.stringify(memberRanks, null, 2));
                resolve();
            });
        });
    }

    function pullAndDeploy() {
        const promises = [];
        shared.getUbisoftTicket(() => {
            // Pull ranks at first
            if (process.env.withRanks) {
                promises.push(getAllPlayerRanks());
            }
            // pull data when ranks or not
            Promise.all(promises).then(() => {
                const promisesInner = [];
                // start android
                promisesInner.push(writeResultsDown().then(() => {
                    return readResults();
                }));
                // start ios
                promisesInner.push(writeResultsDown(true).then(() => {
                    return readResults(true);
                }));
                // wait for all
                Promise.all(promisesInner).then(() => {
                    // print
                    console.log("pullAndDeploy.All server data is in da house");
                    return true;
                }, (...error) => {
                    console.error("pullAndDeploy.Promise.all.error", JSON.stringify(error));
                    console.log("pullAndDeploy.Not all server data is in da house");
                    return true;
                }).then(() => {
                    printResults();
                    done();
                });
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
            console.log("onlyReadAndDeploy.All server data readed from files");
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