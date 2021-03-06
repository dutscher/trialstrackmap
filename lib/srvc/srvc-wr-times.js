angular.module("trialsTrackmap")
    .service("WRTimes", function (
        myJson, tflforoApi, bonxyApi, garage,
        $http, $q, $rootScope, $filter, $timeout, $languages
    ) {

        var scope,
            countryData = {},
            riderRaw = null,
            rider = {},
            timesRaw = null,
            times = {},
            timesStr = "",
            timesStrWithoutIDs = "",
            allOs = {},
            osKeys = [],
            allWorlds = {},
            worldKeys = [],
            bikeTypes = {},
            bikeTypeKeys = [],
            defaultOS = {},
            defaultWR = {},
            pattern = {
                "android-normal": 0,
                "android-donkey": 1,
                "android-crazy": 2,
                "ios-normal": 3,
                "ios-donkey": 4,
                "ios-crazy": 5
            },
            // https://github.com/madebybowtie/FlagKit/tree/master/Assets/PNG
            convertPattern = {
                "usa": "us",
                "us": "us",
                "pt": "br",
                "tbr": "br",
                "bra": "br",
                "ca": "ca",
                "can": "ca",
                "gr": "gr",
                "gre": "gr",
                "grc": "gr",
                "ind": "in",
                "aut": "at",
                "aus": "au",
                "ger": "de",
                "ge": "de",
                "itge": "de",
                "ita": "it",
                "uk": "en",
                "gbr": "en",
                "eng": "en",
                "egy": "eg",
                "eg": "eg",
                "swe": "se",
                "cze": "cz",
                "cro": "hr",
                "nor": "no",
                "no": "no",
                "est": "ee",
                "jap": "jp",
                "jpn": "jp",
                "rus": "ru",
                "fra": "fr",
                "ltu": "lt",
                "co": "co",
                "col": "co",
                "nld": "nl",// netherlands
                "ukr": "ua",
                "chn": "cn",// china
                "rou": "ro",//
                "mex": "mx",
                "pol": "pl",
                "hun": "hu",// hungary
                "sk": "sk",
                "svk": "sk",// slovakia
                "vn": "vn",// vietnam
                "tw": "tw", // taiwan
                "li": "li" // liechtenstein
            },
            convertKeys = Object.keys(convertPattern).concat($languages),
            resave,
            thisScope = {
                extend: function (name, object) {
                    if (!(name in object)) {
                        this[name] = object;
                    }
                    // init
                    if (name === "improveTimes") {
                        allOs = this.improveTimes.getAllOS();
                        osKeys = this.improveTimes.getAllOS(true);
                        allWorlds = this.improveTimes.getAllOS();
                        worldKeys = this.improveTimes.getAllOS(true);
                        bikeTypes = this.improveTimes.getBikeTypes();
                        bikeTypeKeys = this.improveTimes.getBikeTypes(true);
                        // create default
                        defaultWR = {};
                        osKeys.forEach(function (os) {
                            defaultOS[os] = {};
                            defaultWR[os] = {};
                            bikeTypeKeys.forEach(function (bikeType) {
                                defaultWR[os][bikeType] = {
                                    rider: "",
                                    time: 0
                                };
                            });
                        });
                    }

                    if (name === "trackData") {

                    }

                    return this;
                },

                setScope: function (_scope_) {
                    scope = _scope_;
                    return this;
                },

                reload: function () {
                    return bonxyApi.getLeaders();
                },

                get: function (forceUpdate) {
                    if (!forceUpdate && Object.keys(times).length > 0) {
                        var deferred = $q.defer();
                        deferred.resolve(times);
                        return deferred.promise;
                    }

                    // add public worldrecord data
                    return this.reload()
                        .then(function (_data_) {
                            return thisScope.set(_data_);
                        });
                },

                set: function (_data_) {
                    riderRaw = _data_.rider;
                    rider = {};
                    timesRaw = _data_.times;
                    times = {};

                    timesStr = JSON.stringify(timesRaw);
                    timesStrWithoutIDs = timesStr.replace(/("\d{1,3}":)/g, "");

                    Object.keys(timesRaw).forEach(function (trackId) {
                        var worldRecords = timesRaw[trackId].split("|");
                        times[trackId] = {};
                        osKeys.forEach(function (os) {
                            times[trackId][os] = {};
                            bikeTypeKeys.forEach(function (bikeType) {
                                var raw = worldRecords[pattern[os + "-" + bikeType]];
                                var rawArr = raw.split(":");
                                var riderIndicie = thisScope.getRiderNameByID(rawArr[0]).split(':')
                                times[trackId][os][bikeType] = {
                                    id: rawArr[0],
                                    riderId: riderIndicie[1],
                                    riderName: riderIndicie[0],
                                    bikeId: rawArr[2],
                                    paintjobId: rawArr[3],
                                    country: thisScope.getRiderCountry(riderIndicie[0]),
                                    time: rawArr[1]
                                };
                            });
                        });
                    });

                    return times;
                },

                save: function (trackId, riderId, newTime) {
                    return this.reload().then(function (_data_) {
                        var allTimes = _data_.times,
                            trackTimes = allTimes[trackId] ? allTimes[trackId].split("|") : Array(Object.keys(pattern).length).join(",").split(","),
                            os = thisScope.improveTimes.getOS(),
                            bikeType = thisScope.improveTimes.getBikeType();

                        // update os and bike time
                        trackTimes[pattern[os + "-" + bikeType]] = riderId + ":" + newTime;
                        // revert to database style
                        allTimes[trackId] = trackTimes.join("|");
                        // revert all the data
                        _data_.times = allTimes;

                        // update online
                        return myJson.setWRData(_data_).then(function () {
                            thisScope.set(_data_);
                            if (scope) {
                                $timeout(function () {
                                    scope.$apply();
                                    $rootScope.$emit("data:reload");
                                }, 0);
                            }
                        });
                    });
                },

                resave: function (trackId, riderId, newTime) {
                    var allTimes = resave && "times" in resave ? resave.times : timesRaw,
                        trackTimes = allTimes[trackId] ? allTimes[trackId].split("|") : Array(Object.keys(pattern).length).join(",").split(","),
                        os = thisScope.improveTimes.getOS(),
                        bikeType = thisScope.improveTimes.getBikeType();

                    // update os and bike time
                    trackTimes[pattern[os + "-" + bikeType]] = riderId + ":" + newTime;
                    // revert to database style
                    allTimes[trackId] = trackTimes.join("|");
                    // revert all the data
                    if (!resave) {
                        resave = {times: timesRaw, rider: riderRaw};
                    }
                    resave.times = allTimes;
                },

                resaveData: function () {
                    //console.log(resave)
                    //myJson.setWRData(resave);
                },

                getWROfTrack: function (trackId) {
                    var os = this.improveTimes.getOS(),
                        bikeType = this.improveTimes.getBikeType();

                    return trackId in times ? times[trackId][os][bikeType] : {};
                },

                setRiderCountries: function (_data_) {
                    _data_.map(function (data) {
                        if (data.country !== "") {
                            var countryCode = data.country.toLowerCase();
                            countryData[data.name.replace(",", "")] = (countryCode in convertPattern) ? convertPattern[countryCode] : countryCode;
                        }
                        return data;
                    });
                },

                getRiderCountry: function (riderName) {
                    var country = "";
                    var riderHasCountry = riderName in countryData;

                    if (country === "" && riderHasCountry) {
                        country = countryData[riderName];
                    }

                    return country;
                },

                getRider: function () {
                    if (Object.keys(rider).length > 0) {
                        return rider;
                    } else {
                        var riderKeys = Object.keys(riderRaw);
                        rider = {};
                        riderKeys.forEach(function (riderId) {
                            var wrsOfRider = thisScope.getCountOfRiderId(riderId);
                            var riderIndicie = riderRaw[riderId].split(':');
                            rider[riderId] = {
                                id: riderId,
                                riderName: riderIndicie[0],
                                riderId: riderIndicie[1],
                                country: thisScope.getRiderCountry(riderIndicie[0]),
                                WRAmount: wrsOfRider.amount,
                                tracks: wrsOfRider.tracks,
                                worlds: wrsOfRider.worlds
                            }

                            // if(riderIndicie[0] === 'Clarky_Boi_TFG') {
                            //     const data = rider[riderId].tracks.android;
                            //     data.normal.forEach((trackID) => {
                            //         const trackData = thisScope.trackData.getTrackByID(trackID);
                            //         console.log(trackData);
                            //     });
                            //     data.donkey.forEach((trackID) => {
                            //         const trackData = thisScope.trackData.getTrackByID(trackID);
                            //         console.log(trackData);
                            //     });
                            // }
                        });
                        return rider;
                    }
                },

                getRiderNameByID: function (riderId) {
                    return riderRaw[riderId] || '';
                },

                getRiderByID: function (riderId) {
                    var isIn = (rider in rider);
                    return isIn ? rider[riderId] : null;
                },

                getAllRiderByName: function (riderName) {
                    var results = $filter("WRRiderSearch")(rider, riderName, true);
                    return results.length > 0 ? results : [];
                },

                getRiderSortedByOS: function (
                    sortByBikeTypeAndroid, sortDirectionAndroid,
                    sortByBikeTypeIos, sortDirectionIos,
                    selectedWorld
                ) {
                    var allOs, bikeTypes, sortRider,
                        allRider = this.getRider(),
                        allRiderCount = 0,
                        splittedRiderByOS = null,
                        allTracks = [],
                        checkWorld = selectedWorld > 0;

                    var sorting = {
                        android: {
                            bikeType: sortByBikeTypeAndroid,
                            sortDirection: sortDirectionAndroid
                        },
                        ios: {
                            bikeType: sortByBikeTypeIos,
                            sortDirection: sortDirectionIos
                        }
                    };

                    function detectOS(rider) {
                        var detectedOS = [],
                            allOS = {};

                        allOs.forEach(function (os) {
                            allOS[os] = 0;
                            bikeTypes.forEach(function (bikeType) {
                                var amount = rider.WRAmount[os][bikeType];
                                allOS[os] += amount;
                            });

                            if (allOS[os] > 0) {
                                detectedOS.push(os);
                            }
                        });

                        return detectedOS;
                    }

                    function sortArray(x, y) {
                        if (x < y) {
                            return -1;
                        } else if (x > y) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }

                    allOs = this.improveTimes.getAllOS(true);
                    allWorlds = this.improveTimes.getAllWorlds(true);
                    bikeTypes = this.improveTimes.getBikeTypes(true);

                    // split all rider to their platform
                    if (splittedRiderByOS === null) {
                        splittedRiderByOS = {};
                        Object.keys(allRider)
                            .forEach(function (riderId) {
                                var rider = allRider[riderId],
                                    allDetectedOS = detectOS(rider),
                                    tracks = rider.tracks;

                                // default use all tracks
                                var tracks = rider.tracks;
                                // use world tracks instead of all
                                if (checkWorld) {
                                    tracks = rider.worlds[selectedWorld];
                                }

                                if (tracks && Object.keys(tracks).length > 0) {
                                    allDetectedOS.forEach(function (os) {
                                        if (!(os in splittedRiderByOS)) {
                                            splittedRiderByOS[os] = [];
                                        }
                                        allRiderCount++;
                                        splittedRiderByOS[os].push(rider);
                                    });

                                    bikeTypes.forEach(function (bikeType) {
                                        allOs.forEach(function (os) {
                                            if (os in tracks
                                                && bikeType in tracks[os]) {
                                                var trackIds = tracks[os][bikeType];
                                                trackIds.forEach(function (trackId) {
                                                    var trackNotInAll = allTracks.indexOf(trackId) === -1;

                                                    if (trackNotInAll) {
                                                        allTracks.push(trackId);
                                                    }
                                                })
                                            }
                                        });
                                    });
                                }
                            });
                    }

                    sortRider = angular.extend({}, splittedRiderByOS);

                    // sort by amount platforms
                    Object.keys(sortRider).forEach(function (os) {
                        // sort by name
                        sortRider[os] = sortRider[os]
                            .sort(function (a, b) {
                                var x, y,
                                    first, second,
                                    direction = sorting[os].sortDirection || "asc";

                                if (direction === "asc") {
                                    first = b;
                                    second = a;
                                } else if (direction === "desc") {
                                    first = a;
                                    second = b;
                                }

                                x = first.riderName;
                                y = second.riderName;
                                return sortArray(x, y);
                            })
                            // sort by amount
                            .sort(function (a, b) {
                                var x, y,
                                    first, second,
                                    bikeType = sorting[os].bikeType || "normal",
                                    direction = sorting[os].sortDirection || "asc";

                                if (direction === "asc") {
                                    first = b;
                                    second = a;
                                } else if (direction === "desc") {
                                    first = a;
                                    second = b;
                                }

                                if (!checkWorld) {
                                    x = first.WRAmount[os][bikeType];
                                    y = second.WRAmount[os][bikeType];
                                } else {
                                    x = 0;
                                    y = 0;

                                    if (selectedWorld in first.worlds
                                        && os in first.worlds[selectedWorld]
                                        && bikeType in first.worlds[selectedWorld][os]
                                    ) {
                                        x = first.worlds[selectedWorld][os][bikeType].length || 0;
                                    }
                                    if (selectedWorld in second.worlds
                                        && os in second.worlds[selectedWorld]
                                        && bikeType in second.worlds[selectedWorld][os]
                                    ) {
                                        y = second.worlds[selectedWorld][os][bikeType].length || 0;
                                    }
                                }

                                return sortArray(x, y);
                            });
                    });

                    return {
                        allRiderCount: allRiderCount,
                        allTrackCount: allTracks.length,
                        leaders: sortRider
                    }
                },

                getRiderSortedByType: function (selectedWorld) {

                    var allOs, bikeTypes, sortRider = {},
                        allRider = this.getRider(),
                        checkWorld = selectedWorld > 0;

                    function sortArray(x, y) {
                        if (x < y) {
                            return -1;
                        } else if (x > y) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }

                    function sortType(array) {
                        array.sort(function (a, b) {
                            var x, y,
                                first, second,
                                direction = "asc";

                            if (direction === "asc") {
                                first = b;
                                second = a;
                            } else if (direction === "desc") {
                                first = a;
                                second = b;
                            }

                            x = first.amount;
                            y = second.amount;

                            return sortArray(x, y);
                        });
                    }

                    allOs = this.improveTimes.getAllOS(true);
                    bikeTypes = this.improveTimes.getBikeTypes(true);
                    bikeTypes.forEach(function (type) {
                        sortRider[type] = [];
                    });
                    sortRider.total = [];
                    sortRider.tracks = [];
                    var countries = {};
                    sortRider.countries = [];

                    // collect them
                    //console.log("allRider", allRider)
                    Object.keys(allRider).forEach(function (riderId) {
                        var amountTotal = 0,
                            rider = allRider[riderId];
                        // id: "0"
                        // riderName: "AurisTFG"
                        // country: "lt"
                        // WRAmount:
                        //  android: {normal: 21, donkey: 67, crazy: 109}
                        //  ios: {normal: 0, donkey: 0, crazy: 0}
                        // tracks:
                        //  android: {normal: Array(21), donkey: Array(67), crazy: Array(109)}
                        // worlds:
                        //  1: android: {normal: Array(12), donkey: Array(39), crazy: Array(28)}
                        //  2: android: {normal: Array(9), donkey: Array(28), crazy: Array(81)}

                        // default use all tracks
                        var tracks = rider.tracks;
                        // use world tracks instead of all
                        if (checkWorld) {
                            tracks = rider.worlds[selectedWorld];
                        }

                        if (tracks && Object.keys(tracks).length > 0) {

                            bikeTypes.forEach(function (bikeType) {
                                var osTogether = 0;

                                allOs.forEach(function (os) {
                                    if (os in tracks
                                        && bikeType in tracks[os]) {
                                        var trackIds = tracks[os][bikeType],
                                            amountOfType = trackIds.length;

                                        amountTotal += amountOfType;
                                        osTogether += amountOfType;

                                        trackIds.forEach(function (trackId) {
                                            var trackData = thisScope.trackData.getTrackByID(trackId),
                                                trackNotInAll = sortRider.tracks.indexOf(trackId) === -1;
                                            if (trackNotInAll && (
                                                !checkWorld || checkWorld && selectedWorld === trackData.world
                                            )) {
                                                sortRider.tracks.push(trackId);
                                            }
                                        })
                                    }
                                });

                                if (osTogether > 1) {
                                    sortRider[bikeType].push({
                                        riderName: rider.riderName,
                                        country: rider.country,
                                        amount: osTogether,
                                    });
                                }
                            });

                            if (!(rider.country in countries)) {
                                countries[rider.country] = amountTotal;
                            } else {
                                countries[rider.country] += amountTotal;
                            }

                            if (amountTotal > 0) {
                                sortRider.total.push({
                                    riderName: rider.riderName,
                                    country: rider.country,
                                    amount: amountTotal
                                });
                            }

                        }
                    });

                    Object.keys(countries).forEach(function (countryCode) {
                        sortRider.countries.push({
                            country: countryCode,
                            amount: countries[countryCode]
                        })
                    });

                    // sort them
                    bikeTypes.forEach(function (type) {
                        sortType(sortRider[type]);
                    });
                    sortType(sortRider.total);
                    sortType(sortRider.countries);

                    return {
                        allRiderCount: sortRider.total.length,
                        allTrackCount: sortRider.tracks.length,
                        leaders: sortRider
                    }
                },

                getRiderSortedByTracks: function (selectedWorld) {
                    var allOs, bikeTypes, leaders = [],
                        allRider = this.getRider(),
                        allRiderCount = 0,
                        allTracks = thisScope.trackData.getData().tracks,
                        checkWorld = selectedWorld > 0;

                    allOs = this.improveTimes.getAllOS(true);
                    bikeTypes = this.improveTimes.getBikeTypes(true);

                    allTracks.forEach(function (track) {
                        var WRHolder = {},
                            WRTimes = times[track.id];

                        if (WRTimes && (!checkWorld || checkWorld && track.world === selectedWorld)) {
                            // WRHolder
                            // normal           | donkey            | crazy
                            // A Aurimas 14932  | A Akrasiia 15369
                            allOs.forEach(function (os) {
                                var otherOS = os === 'ios' ? os : 'android';
                                bikeTypes.forEach(function (bikeType) {
                                    var WRTime;
                                    if (os in WRTimes && bikeType in WRTimes[os]) {
                                        WRTime = WRTimes[os][bikeType];
                                        var riderData = allRider[WRTime.id];
                                        WRTime.os = os;
                                        WRTime.country = riderData ? riderData.country : "";
                                        WRTime.bikeName = garage.getBikeName(WRTime.bikeId);
                                        // wr holder not exists or is lower then the existing
                                        if(!WRHolder[bikeType] || WRTime.time < WRHolder[bikeType].time) {
                                            WRHolder[bikeType] = WRTime;
                                        }
                                    }
                                });
                            });

                            leaders.push({
                                i18n: track.i18n,
                                WRHolder: WRHolder
                            });
                        }
                    });

                    return {
                        allRiderCount: allRiderCount,
                        allTrackCount: leaders.length,
                        leaders: leaders
                    }
                },

                addRider: function (riderName, _data_) {
                    var nextRiderId = Object.keys(_data_.rider).length + 1;
                    // add to object
                    _data_.rider[nextRiderId] = riderName;
                    // save online
                    myJson.setWRData(_data_);
                    // update model
                    this.set(_data_);
                    // inform rest page
                    $rootScope.$emit("data:reload");

                    return nextRiderId;
                },

                getOne: function (trackId) {
                    var returnWR = angular.extend({}, defaultWR);

                    if (trackId in times) {
                        returnWR = times[trackId];
                    }

                    return returnWR;
                },

                getCountOfRiderId: function (riderId) {
                    var regexp,
                        amount = angular.extend({}, defaultOS),
                        tracks = {},
                        worlds = {};

                    if (!riderId) {
                        return amount;
                    }

                    // itearte android and ios
                    osKeys.forEach(function (os) {
                        amount[os] = {};
                        var otherOS = os !== "ios" ? "ios" : "android";
                        // iterate the bikeTypes normal / donkey  /crazy
                        bikeTypeKeys.forEach(function (bikeType) {
                            amount[os][bikeType] = 0;
                            // iterate the times from myjson to find ridersAmountOfWR's
                            Object.keys(times).forEach(function (trackId) {
                                var trackData = thisScope.trackData.getTrackByID(trackId),
                                    timesOfOS = times[trackId][os][bikeType],
                                    differentTimesOfOS = times[trackId][otherOS][bikeType];

                                // json to string and do a regexp find riderID
                                // {"riderId":"4","riderName":"Somnic","bikeId":"10",
                                // "paintjobId":"0","country":"","time":"21332"}
                                // console.log(timesOfOS, differentTimesOfOS)
                                if (
                                    timesOfOS.id === riderId
                                    &&
                                    timesOfOS.time < differentTimesOfOS.time
                                ) {
                                    // seperate by tracks
                                    if (!(os in tracks)) {
                                        tracks[os] = {};
                                    }
                                    if (!(bikeType in tracks[os])) {
                                        tracks[os][bikeType] = [];
                                    }
                                    tracks[os][bikeType].push(parseInt(trackId, 10));

                                    // seperate by world
                                    if (!(trackData.world in worlds)) {
                                        worlds[trackData.world] = {};
                                    }
                                    if (!(os in worlds[trackData.world])) {
                                        worlds[trackData.world][os] = {};
                                    }
                                    if (!(bikeType in worlds[trackData.world][os])) {
                                        worlds[trackData.world][os][bikeType] = [];
                                    }
                                    worlds[trackData.world][os][bikeType].push(parseInt(trackId, 10));
                                }
                            });

                            amount[os][bikeType] = (tracks[os] && tracks[os][bikeType]) ? tracks[os][bikeType].length : 0;
                        });
                    });

                    return {
                        tracks: tracks,
                        amount: amount,
                        worlds: worlds
                    };
                }
            };

        return thisScope;
    })
