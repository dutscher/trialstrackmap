angular.module("trialsTrackmap")
    .service("improveTimes", function (
        localStorageService, myJson, security, WRTimes,
        $filter, $timeout) {
        var identifier = "times",
            os = "",
            bikeType = "",
            bikeModel = "",
            error = "?!?",
            empty = "?????",
            times = {},
            scope,
            // type - os - bikeType
            pattern = {
                "myRank-android-normal": 0,
                "myTime-android-normal": 1,
                "myRank-android-donkey": 2,
                "myTime-android-donkey": 3,
                "myRank-android-crazy": 4,
                "myTime-android-crazy": 5,
                "myRank-ios-normal": 6,
                "myTime-ios-normal": 7,
                "myRank-ios-donkey": 8,
                "myTime-ios-donkey": 9,
                "myRank-ios-crazy": 10,
                "myTime-ios-crazy": 11,
                "myGoal-android-normal": 12,
                "myGoal-android-donkey": 13,
                "myGoal-android-crazy": 14,
                "myGoal-ios-normal": 15,
                "myGoal-ios-donkey": 16,
                "myGoal-ios-crazy": 17,
                "myBike-android-normal": 18,
                "myBike-android-donkey": 19,
                "myBike-android-crazy": 20,
                "myBike-ios-normal": 21,
                "myBike-ios-donkey": 22,
                "myBike-ios-crazy": 23,
                "myFaults-android-normal": 24,
                "myFaults-android-donkey": 25,
                "myFaults-android-crazy": 26,
                "myFaults-ios-normal": 27,
                "myFaults-ios-donkey": 28,
                "myFaults-ios-crazy": 29,
                "myGoalFaults-android-normal": 30,
                "myGoalFaults-android-donkey": 31,
                "myGoalFaults-android-crazy": 32,
                "myGoalFaults-ios-normal": 33,
                "myGoalFaults-ios-donkey": 34,
                "myGoalFaults-ios-crazy": 35,
                "myRankPercent-android-normal": 36,
                "myRankPercent-android-donkey": 37,
                "myRankPercent-android-crazy": 38,
                "myRankPercent-ios-normal": 39,
                "myRankPercent-ios-donkey": 40,
                "myRankPercent-ios-crazy": 41
            },
            allWorlds = {
                1: "Seymore & Lotz",
                2: "Petrol Falls"
            },
            allOs = {
                "android": "Android",
                "ios": "iOS"
            },
            bikeTypes = {
                "normal": "Normal",
                "donkey": "Donkey",
                "crazy": "Crazy"
            },
            worldKeys = Object.keys(allWorlds),
            osKeys = Object.keys(allOs),
            bikeTypeKeys = Object.keys(bikeTypes),
            emptyEntry = Array(Object.keys(pattern).length).join(",").split(",");

        /*
         my rank: 122 // android normal
         my time: 0:00.000 // android normal
         my rank: 122 // android donkey
         my time: 0:00.000 // android donkey
         my rank: 122 // android crazy
         my time: 0:00.000 // android crazy
         my rank: 124 // ios normal
         my time: 0:00.000 // ios normal
         my rank: 124 // ios donkey
         my time: 0:00.000 // ios donkey
         my rank: 124 // ios crazy
         my time: 0:00.000 // ios crazy
         {
         "1": "122|000000|122|000000|122|000000|124|000000|124|000000|124|000000"
         }
         */
        function pad(num, size) {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        }

        function convertTime(_time_, showZero) {
            function insertAt(string, inseration, position) {
                return [string.slice(0, position), inseration, string.slice(position)].join("");
            }

            // check and make 22000 -> 022000
            // check and make 2200 -> 002200
            // check and make 220 -> 000220
            // check and make 22 -> 000022
            var time = "" + pad(_time_, 6);

            // insert 022000 -> 0:22000
            time = insertAt(time, ":", 1);
            // insert 0:22000 -> 0:22.000
            time = insertAt(time, ".", 4);
            return time;
        }

        function isNaN(obj) {
            return obj !== obj;
        }

        function clearTime(_time_) {
            if (typeof _time_ !== "string") {
                _time_ = "" + _time_;
            }
            // 0 -> 0
            // 0:22.000 -> 22000
            // 022000 -> 22000
            // 002200 -> 2200
            var time = _time_
                .replace(/(:)/g, "")
                .replace(/(\.)/g, "")
                .replace(/^0*/, "");

            time = parseInt(time, 10);

            if (isNaN(time)) {
                time = 0;
            }

            return Math.round(time);
        }

        function getAll() {
            times = localStorageService.get(identifier);

            //var json = JSON.stringify(times);
            //json = json.replace(/(\|\d{5,6})(\|\d{5,6})/g, "$1")
            //localStorageService.set(identifier, JSON.parse(json));

            if (times == null) {
                times = {};
            }
        }

        // init
        getAll();

        var thisScope = {
            fileName: "trialsFrontierImproveData",
            fileMimeType: "application/json",
            fileExtension: "json",
            //fileMimeType: "text/plain",
            //fileExtension: "txt",
            autoExportLsKey: "autoExport",
            error: error,
            setScope: function (_scope_) {
                scope = _scope_;
                return this;
            },
            setOS: function (_os_) {
                os = _os_;
            },
            getOS: function () {
                return os;
            },
            getAllOS: function (asKeys) {
                return !asKeys ? allOs : osKeys;
            },
            getAllWorlds: function(asKeys){
                return !asKeys ? allWorlds : worldKeys;
            },
            setBikeType: function (_bikeType_) {
                bikeType = _bikeType_;
            },
            getBikeType: function () {
                return bikeType;
            },
            getBikeTypes: function (asKeys) {
                return !asKeys ? bikeTypes : bikeTypeKeys;
            },
            setBikeModel: function (_bikeModel_) {
                bikeModel = _bikeModel_;
            },
            getPattern: function () {
                return pattern;
            },
            getAll: function (force) {
                if (force) {
                    getAll();
                }

                return times;
            },
            getOne: function (trackId, trackData) {
                var data = this.getOneByType("all", trackId),
                    keys = Object.keys(pattern),
                    initData = {};

                if (!trackData) {
                    alert($filter("translate")("page.timesTable.error.missingData"));
                    console.error($filter("translate")("page.timesTable.error.missingData"));
                    return false;
                }

                //if (!("times" in trackData)) {
                //    console.warn("track has no times", trackData);
                //}

                osKeys.forEach(function (_os_) {
                    initData[_os_] = {};
                    bikeTypeKeys.forEach(function (_bikeType_) {
                        var _data_ = {};

                        // set myRank, myTime, myGoal & myBike
                        keys.forEach(function (key, index) {
                            // skip wrong os
                            if (key.indexOf(_os_) === -1) {
                                return;
                            }
                            // skip wrong bikeType
                            if (key.indexOf(_bikeType_) === -1) {
                                return;
                            }

                            var clearKey = key.replace(/(-\w.*)/g, "");

                            if (data === error || data[index] === "" || !data[index]) {
                                _data_[clearKey] = (clearKey === "myRank") ? error : "";
                            } else if (clearKey === "myBike") {
                                var bikeData = data[index].split("-");
                                _data_[clearKey] = {
                                    bikeId: bikeData[0],
                                    paintjobId: bikeData[1]
                                };
                            } else {
                                _data_[clearKey] = data[index];
                            }
                        });

                        if (!("times" in trackData)) {
                            _data_.differenceTime = "";
                            _data_.differenceTimeWR = "";
                            return;
                        }

                        // difference myTime to worldRecord
                        if (_data_.myTime !== error
                            && trackData.times.worldRecord
                            && trackData.times.worldRecord[_os_][_bikeType_].time !== error) {
                            _data_.differenceTime = thisScope
                                .compareTime(_data_.myTime, trackData.times.worldRecord[_os_][_bikeType_].time);
                        }

                        // difference myGoal to myTime
                        if (_data_.myTime !== error
                            && _data_.myGoal !== error) {
                            _data_.differenceTimeMyGoal = thisScope
                                .compareTime(_data_.myTime, _data_.myGoal);
                        }

                        // difference worldRecord to platinumTime
                        if (trackData.times.worldRecord
                            && trackData.times.platinum
                            && trackData.times.worldRecord[_os_][_bikeType_].time !== error) {
                            _data_.differenceTimeWR = thisScope
                                .compareTime(trackData.times.worldRecord[_os_][_bikeType_].time, trackData.times.platinum.time);
                        }

                        // ultimate time
                        if (_data_.myTime !== error
                            && trackData.times.silver
                            && trackData.times.gold
                            && trackData.times.platinum) {
                            _data_.ultimate = thisScope.getUlitmateData(trackData, _data_.myTime);
                        } else {
                            _data_.ultimate = "";
                        }

                        initData[_os_][_bikeType_] = _data_;
                    });
                });

                return initData;
            },

            getOneByType: function (type, trackId) {
                if (!(trackId in times)) {
                    return error;
                }

                var data = times[trackId].split("|");

                if (type !== "all") {
                    var value = data[pattern[type]] || empty;

                    if (type !== "myRank") {
                        value = convertTime(value);
                    }

                    return value;
                } else {
                    return data || emptyEntry;
                }
            },

            getImproveOfTrack: function (trackId, type) {
                var os = this.getAllOS(),
                    bikeType = this.getBikeType(),
                    trackTimes = (trackId in times) ? times[trackId] : "",
                    arrTimes = trackTimes.split("|"),
                    dataIndex = pattern[type + "-" + os + "-" + bikeType];
                return arrTimes[dataIndex] || null;
            },
            // on track per request and update only one value "myRank" | "myTime" | "myGoal"
            updateOne: function (_trackId_, _typeValues_) {
                var data = this.getOneByType("all", _trackId_),
                    data = this.handleNotCorrectFormat(data),
                    typeKeys = Object.keys(_typeValues_);

                typeKeys.forEach(function (_type_) {
                    var type = _type_ + "-" + os + "-" + bikeType,
                        value;

                    // parse to valid times
                    value = thisScope.handleValue(_type_, _typeValues_[_type_]);
                    data[pattern[type]] = value !== 0 ? value : "";
                });

                // save
                times[_trackId_] = data.join("|");

                this.handleExport(_trackId_);
            },
            // more than one track for one request
            updateMore: function (_tracksData_) {
                var trackIds = Object.keys(_tracksData_),
                    os = this.getAllOS();
                // iterate tracks
                trackIds.forEach(function (_trackId_) {
                    var data = thisScope.getOneByType("all", _trackId_), // get local state
                        data = thisScope.handleNotCorrectFormat(data), // check if isnt empty
                        importDataBikeKeys = Object.keys(_tracksData_[_trackId_]);
                    // iterate the bikeTypes normal | donkey | crazy
                    importDataBikeKeys.forEach(function (_bikeType_) {
                        var importDataKeys = Object.keys(_tracksData_[_trackId_][_bikeType_]);
                        // iterate the types myTime | myRank | myBike
                        importDataKeys.forEach(function (_type_) {
                            // myGoal-android-normal
                            var type = _type_ + "-" + os + "-" + _bikeType_,
                                value = thisScope.handleValue(_type_, _tracksData_[_trackId_][_bikeType_][_type_]);
                            data[pattern[type]] = value !== 0 ? value : "";
                        });
                    });
                    // save local
                    times[_trackId_] = data.join("|");
                });

                this.handleExport();
            },

            handleValue: function (type, oldValue) {
                var newValue;
                switch (type) {
                    case "myBike":
                    case "myRankPercent":
                        newValue = oldValue;
                        break;
                    default:
                        newValue = clearTime(oldValue);
                }

                return newValue;
            },

            handleNotCorrectFormat: function (_data_) {
                // first entry
                if (_data_ === error) {
                    _data_ = angular.extend([], emptyEntry);
                    // migrate old to new pattern
                } else if (_data_.length < Object.keys(pattern).length) {
                    var empty = angular.extend([], emptyEntry);
                    empty.forEach(function (value, index) {
                        if (index in _data_) {
                            empty[index] = _data_[index];
                        }
                    });
                    _data_ = empty;
                }
                return _data_;
            },

            handleExport: function (_trackId_) {
                localStorageService.set(identifier, times);
                this.getAll(true);

                // autoexport
                if (localStorageService.get(this.autoExportLsKey)) {
                    var data = this.getEmptyData(scope);

                    myJson.save(data, null, null, true);
                }

                if (scope && "track" in scope && _trackId_) {
                    this.refreshImproveOfOneTrack(_trackId_);
                } else {
                    this.refreshImproveOfAllTracks();
                }
            },

            compareTime: function (first, second) {
                if (!first
                    || first == error
                    || first.indexOf("?") >= 0
                    || !second
                    || second == error
                    || second.indexOf("?") >= 0
                ) {
                    return "";
                }

                var firstTime = clearTime(first),
                    secondTime = clearTime(second),
                    isBetter = firstTime > secondTime,
                    calcedTime = firstTime - secondTime;

                return {
                    prefix: isBetter ? "+" : "-",
                    time: !isBetter ? calcedTime * -1 : calcedTime
                };
            },
            convertTime: function (_time_, showZero) {
                if (_time_ === error || !_time_ && !showZero) {
                    _time_ = empty;
                }
                return convertTime(_time_);
            },
            clearTime: clearTime,

            importData: function (_data_) {
                if (!_data_) {
                    return;
                }

                var times = _data_.times,
                    otherData = [
                        "selectedOs",
                        "selectedBike",
                        "minRank",
                        "minDiff",
                        "selectedSort",
                        "selectedSortType",
                        "showMyGoal",
                        "profileName",
                        "profileRank",
                        "tflforoProfileId"
                    ];
                localStorageService.set(identifier, times);
                this.getAll(true);
                // apply data from export to scope
                if (scope && "data" in scope && "tracks" in scope.data) {

                    otherData.forEach(function (_var_) {
                        if (_var_ in _data_ && _data_[_var_] !== null) {
                            scope[_var_] = _data_[_var_];
                            localStorageService.set(_var_, _data_[_var_]);
                        }
                    });

                    thisScope.refreshImproveOfAllTracks();

                    return true;
                }
                return false;
            },

            refreshImproveOfOneTrack: function (_trackId_) {
                scope.track.improve = this.getOne(_trackId_, scope.track);
                $timeout(function () {
                    scope.$apply();
                }, 0);
            },

            refreshImproveOfAllTracks: function () {
                scope.data.tracks.forEach(function (track) {
                    var trackId = track.id;
                    // improve time
                    track.improve = thisScope.getOne(trackId, track);
                });

                $timeout(function () {
                    scope.$apply();
                }, 0);
            },

            getEmptyData: function (scope) {
                var times = this.getAll();
                return {
                    date: (new Date()).getTime(),
                    dateEdit: (new Date()).getTime(),
                    selectedOs: scope.selectedOs,
                    selectedBike: scope.selectedBike,
                    selectedSort: scope.selectedSort,
                    selectedSortType: scope.selectedSortType,
                    minRank: scope.minRank,
                    minDiff: scope.minDiff,
                    showMyGoal: scope.showMyGoal,
                    profileName: scope.profileName,
                    profileRank: scope.profileRank,
                    tflforoProfileId: scope.tflforoProfileId,
                    times: times
                };
            },

            getUlitmateData: function (trackData, _myTime_, _myFaults_) {
                // prepare the emptiness
                if (!_myTime_) {
                    return "";
                }

                var myTime = parseInt(_myTime_),
                    myFaults = parseInt(_myFaults_) || 0,
                    silver = parseInt(trackData.times.silver.time),
                    gold = parseInt(trackData.times.gold.time),
                    platinum = parseInt(trackData.times.platinum.time),
                    ultimate = platinum / 2,
                    medalRange = silver - platinum,
                    zeroFaultScore = 0.0,
                    caseZeroFault = "",
                    adjustedScore,
                    d;

                if (myTime > silver) {
                    zeroFaultScore = thisScope.decayFactor(silver, medalRange, myTime) * 250000;
                    caseZeroFault = "0-fault bronze";
                } else if (myTime <= silver && myTime > gold) {
                    zeroFaultScore = 250000 + thisScope.progressPercent(silver, gold, myTime) * 250000;
                    caseZeroFault = "0-fault silver";
                } else if (myTime <= gold && myTime > platinum) {
                    zeroFaultScore = 500000 + thisScope.progressPercent(gold, platinum, myTime) * 250000;
                    caseZeroFault = "0-fault gold";
                } else if (myTime <= platinum && myTime >= ultimate) {
                    zeroFaultScore = 750000 + thisScope.progressPercent(platinum, ultimate, myTime) * 250000;
                    caseZeroFault = "0-fault plat";
                } else if (myTime < ultimate) {
                    zeroFaultScore = 3000000;
                    caseZeroFault = "ulitmate";
                }

                // Now adjust for faults; 100K/fault
                adjustedScore = zeroFaultScore - myFaults * 100000;
                d = adjustedScore >= 0 ? adjustedScore : 0;

                return {
                    medalTimes: {
                        silver: silver,
                        gold: gold,
                        platinum: platinum,
                        myTime: myTime
                    },
                    score: Math.round(d),
                    zeroFaultScore: zeroFaultScore,
                    time: ultimate,
                    medalRange: medalRange,
                    case: caseZeroFault
                };
            },

            // Returns a number between 0 and 1 (will multiply by 250K later)
            // Assumes riderTime >= silverTime
            decayFactor: function (silverTime, medalRange, riderTime) {
                return Math.exp((silverTime - riderTime) / medalRange)
            },

            // Returns percentage completion as a fraction between 0 and 1.
            // Assumes slowTime >= riderTime >= fastTime
            progressPercent: function (slowTime, fastTime, riderTime) {
                var width = slowTime - fastTime,
                    progress = slowTime - riderTime,
                    pct = progress / width;
                return pct
            }
        };

        thisScope.WRTimes = WRTimes.extend("improveTimes", thisScope);

        return thisScope;
    })