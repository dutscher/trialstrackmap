module.exports = function (shared, done) {
    require("json5/lib/register");

    const debug = false,
        rankLimit = 100,
        pathRequest = "build/leaderboard/",
        pathArchive = `${pathRequest}archive/`,
        settings = require("./01.settings"),
        userName = settings.name,
        userId = settings.id;

    let maxLimit = 2000,
        teams = [];

    console.log(`# userName: ${userName} - userId: ${userId}`);

    if (debug) {
        maxLimit = 100;
        console.log("-----------------");
        console.log("!!!!debug = true", maxLimit, "!!!!");
        console.log("-----------------");
    }

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

        requests.push({
            memberId: userId,
            clearMemberId: userId.replace(/(-1|-2)$/, ""),
            isiOS: false,
        });

        console.log("getAllPlayerRanks for", requests.length, "members");

        function doRequestsForMember(member) {
            return shared.doRequestGetPlayerRank(member.clearMemberId, member.isiOS).then((result) => {
                console.log(result)
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

        shared.setVars("rankLimit", rankLimit);
        shared.setVars("maxLimit", maxLimit);
        shared.setVars("pathRequest", pathRequest);
        shared.setVars("pathArchive", pathArchive);
        shared.setVars("userName", userName);
        shared.setVars("userId", userId);

        shared.getUbisoftTicket(() => {
            promises.push(getAllPlayerRanks());

            Promise.all(promises).then(() => {
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
            console.log("onlyReadAndDeploy.All server data readed from files");
            printResults();
            done();
        });
    }

    // switch
    if (true || process.env.fullPull) {
        pullAndDeploy();
    } else if (process.env.onlyRead) {
        onlyReadAndDeploy();
    } else {
        done();
    }
};