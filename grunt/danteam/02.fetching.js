module.exports = function (shared, done) {
    require("json5/lib/register");

    const debug = false,
        rankLimit = 100,
        pathRequest = "build/danteam/",
        pathArchive = `${pathRequest}archive/`,
        settings = require("./02.settings"),
        activeWeek = settings.week[settings.week.length - settings.activeWeek],
        weekId = activeWeek.id,
        trackName = activeWeek.track,
        trackId = shared.getTrackIdViaName(trackName, true),
        bikeName = activeWeek.bike,
        bikeId = shared.getBikeIdViaName(bikeName),
        withoutBikeIdWeek = activeWeek.withoutBikeId,
        withoutImproveWeek = activeWeek.withoutImprove;

    let maxLimit = 2000,
        teams = [];

    console.log(`# weekId: ${weekId} - trackId: ${trackName}/${trackId} - bikeId: ${bikeName}/${bikeId}`);

    if (debug) {
        maxLimit = 100;
        console.log("-----------------");
        console.log("!!!!debug = true", maxLimit, "!!!!");
        console.log("-----------------");
    }

    // set best player
    settings.allPlayer = [];
    settings.maxLimit = maxLimit;

    teams = [settings.myTeam, activeWeek.opponentTeam];

    console.log("teams", teams);

    shared.ensureDirectoryExistence(`${pathRequest}json.json`);
    shared.ensureDirectoryExistence(`${pathArchive}json.json`);

    // CALC & SORT
    function readResults(isIos) {
        return new Promise((resolve) => {
            const device = shared.getDeviceName(isIos),
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
        console.log(`evaluateResults.${shared.handleDevice(isIos)} / length: ${data.length}`);
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
                    const data = shared.encodeLeaderboardData(
                        score.stats.submittime,
                        score.stats.score_value,
                        found.time,
                        score.stats.data,
                        score.stats.upgrades
                    );
                    found.data = data;
                    found.drivenBike = data.bikeId === bikeId;
                    found.improvement = shared.findImprovement(dataStart, found.time, score.player);
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
                if (player.hasTime && player.hasDrivenBike && withoutImproveWeek && !withoutBikeIdWeek
                    || player.hasTime && withoutImproveWeek && withoutBikeIdWeek
                    || player.hasTime && player.hasImprovement && player.hasDrivenBike) {
                    timesInt += player.time;
                    teamPlayer++;
                    player.isValidTime = true;
                    // add to
                    allImprovedPlayer.push(player);
                } else {
                    allNoneImprovePlayer.push(player);
                }
            });
            // only impromentTimes and improved player times counts
            ratio = timesInt / teamPlayer;

            teamTimes.push({name: team, times: timesInt, teamPlayer: teamPlayer, ratio: Math.round(ratio)});
        });

        // sort all player
        allImprovedPlayer = shared._.sortBy(allImprovedPlayer, ["time"]);
        allNoneImprovePlayer = shared._.sortBy(allNoneImprovePlayer, ["time"]);

        settings.allPlayer = allImprovedPlayer.concat(allNoneImprovePlayer).map((player) => {
            return {
                time: player.time,
                name: player.up,
                isIos: player.isIos,
                bikeId: player.data ? player.data.bikeId : -1,
                paintJobId: player.data ? player.data.paintJobId : -1,
            };
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

        // remove unused teams
        Object.keys(settings.teams).map(teamId => {
            if (teams.indexOf(teamId) === -1) {
                delete settings.teams[teamId];
            }
        });
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
            return shared.doRequestGetPlayerRank(member.clearMemberId, member.isiOS).then((result) => {
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

        shared.setVars("debug", debug);
        shared.setVars("weekId", weekId);
        shared.setVars("trackId", trackId);
        shared.setVars("pathArchive", pathArchive);
        shared.setVars("rankLimit", rankLimit);
        shared.setVars("maxLimit", maxLimit);

        shared.getUbisoftTicket(() => {
            // Pull ranks at first
            if (process.env.withRanks) {
                promises.push(getAllPlayerRanks());
            }
            // pull data when ranks or not
            Promise.all(promises).then(() => {
                const promisesInner = [];
                // start android
                promisesInner.push(shared.writeResultsDown().then(() => {
                    return readResults();
                }));
                // start ios
                promisesInner.push(shared.writeResultsDown(true).then(() => {
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