angular.module("trialsTrackmap")
    .service("WRTimes",
        function (myJson, tflforoApi, bonxyApi,
                  $http, $q, $rootScope, $filter, $timeout, $languages) {

            var scope,
                countryData = {},
                riderRaw = null,
                rider = {},
                timesRaw = null,
                times = {},
                timesStr = "",
                timesStrWithoutIDs = "",
                modes = {},
                modeKeys = [],
                bikeTypes = {},
                bikeTypeKeys = [],
                defaultModes = {},
                defaultWR = {},
                pattern = {
                    "android-normal": 0,
                    "android-donkey": 1,
                    "android-crazy": 2,
                    "ios-normal": 3,
                    "ios-donkey": 4,
                    "ios-crazy": 5
                },
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
                    "eg": "eg",
                    "swe": "se",
                    "cze": "cz",
                    "cro": "hr",
                    "nor": "no",
                    "no": "no",
                    "est": "et",
                    "jpn": "jp",
                    "rus": "ru",
                    "fra": "fr",
                    "ltu": "lt",
                    "co": "co",
                    "col": "co",
                    "nld": "co",
                    "ukr": "ua",
                    "chn": "cn",
                    "rou": "ro",
                    "mex": "mx",
                    "pol": "pl",
                    "hun": "hu"
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
                            modes = this.improveTimes.getModes();
                            modeKeys = Object.keys(modes);
                            bikeTypes = this.improveTimes.getBikeTypes();
                            bikeTypeKeys = Object.keys(bikeTypes);
                            // create default
                            defaultWR = {};
                            modeKeys.forEach(function (mode) {
                                defaultModes[mode] = {};
                                defaultWR[mode] = {};
                                bikeTypeKeys.forEach(function (bikeType) {
                                    defaultWR[mode][bikeType] = {
                                        rider: "",
                                        time: 0
                                    };
                                });
                            });
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
                            modeKeys.forEach(function (mode) {
                                times[trackId][mode] = {};
                                bikeTypeKeys.forEach(function (bikeType) {
                                    var raw = worldRecords[pattern[mode + "-" + bikeType]];
                                    var rawArr = raw.split(":");
                                    var riderName = thisScope.getRiderNameByID(rawArr[0]);

                                    times[trackId][mode][bikeType] = {
                                        riderId: rawArr[0],
                                        riderName: riderName,
                                        bikeId: rawArr[2],
                                        paintjobId: rawArr[3],
                                        country: thisScope.getRiderCountry(riderName),
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
                                mode = thisScope.improveTimes.getMode(),
                                bikeType = thisScope.improveTimes.getBikeType();

                            // update mode and bike time
                            trackTimes[pattern[mode + "-" + bikeType]] = riderId + ":" + newTime;
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
                            mode = thisScope.improveTimes.getMode(),
                            bikeType = thisScope.improveTimes.getBikeType();

                        // update mode and bike time
                        trackTimes[pattern[mode + "-" + bikeType]] = riderId + ":" + newTime;
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
                        var mode = this.improveTimes.getMode(),
                            bikeType = this.improveTimes.getBikeType();

                        return trackId in times ? times[trackId][mode][bikeType] : {};
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
                        convertKeys.forEach(function (_country_) {
                            var regxp = new RegExp("(-|_)" + _country_ + "$|^" + _country_ + "(-_-|-|_)", "i");
                            var match = riderName ? riderName.match(regxp) : null;

                            if (match !== null) {
                                country = (_country_ in convertPattern) ? convertPattern[_country_] : _country_;
                            }
                        });

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
                                rider[riderId] = {
                                    id: riderId,
                                    riderName: riderRaw[riderId],
                                    country: thisScope.getRiderCountry(riderRaw[riderId]),
                                    WRAmount: thisScope.getCountOfRiderId(riderId)
                                }
                            });
                            return rider;
                        }
                    },

                    getRiderNameByID: function (riderId) {
                        return riderRaw[riderId];
                    },

                    getRiderByID: function (riderId) {
                        var isIn = (rider in rider);
                        return isIn ? rider[riderId] : null;
                    },

                    getAllRiderByName: function (riderName) {
                        var results = $filter("WRRiderSearch")(rider, riderName, true);
                        return results.length > 0 ? results : [];
                    },

                    splittedRiderByOS: null,
                    tailRider: null,
                    allRiderCount: 0,
                    getRiderSortedByOS: function (allRider, sortByBikeTypeAndroid, sortDirectionAndroid, sortByBikeTypeIos, sortDirectionIos) {
                        var modes, bikeTypes, returnRider, sortRider,
                            thisScope = this;

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

                            modes.forEach(function (mode) {
                                allOS[mode] = 0;
                                bikeTypes.forEach(function (bikeType) {
                                    var amount = rider.WRAmount[mode][bikeType];
                                    allOS[mode] += amount;
                                });

                                if (allOS[mode] > 0) {
                                    detectedOS.push(mode);
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

                        modes = this.improveTimes.getModes(true);
                        bikeTypes = this.improveTimes.getBikeTypes(true);
                        returnRider = [];

                        // split all rider to their platform
                        if (this.splittedRiderByOS === null) {
                            this.splittedRiderByOS = {};
                            this.tailRider = [];
                            Object.keys(allRider).forEach(function (riderId) {
                                var rider = allRider[riderId],
                                    allDetectedOS = detectOS(rider);

                                allDetectedOS.forEach(function (os) {
                                    if (!(os in thisScope.splittedRiderByOS)) {
                                        thisScope.splittedRiderByOS[os] = [];
                                    }
                                    thisScope.allRiderCount++;
                                    thisScope.splittedRiderByOS[os].push(rider);
                                });

                                if (allDetectedOS.length === 0) {
                                    thisScope.tailRider.push(rider);
                                }
                            });
                        }

                        sortRider = angular.extend({}, this.splittedRiderByOS);

                        // sort by amount platforms
                        Object.keys(sortRider).forEach(function (os) {
                            // sort by name
                            sortRider[os] = sortRider[os].sort(function (a, b) {
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
                                // sort by amount
                            }).sort(function (a, b) {
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

                                x = first.WRAmount[os][bikeType];
                                y = second.WRAmount[os][bikeType];

                                return sortArray(x, y);
                            });
                        });

                        return {
                            date: bonxyApi.getLeadersLastUpdate(),
                            allRiderCount: this.allRiderCount,
                            allRider: sortRider,
                            tailRider: this.tailRider
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
                            _return_ = angular.extend({}, defaultModes);
                        if (!riderId) {
                            return _return_;
                        }

                        regexp = new RegExp('"riderId":"' + riderId + '"', "g");
                        modeKeys.forEach(function (mode) {
                            _return_[mode] = {};
                            bikeTypeKeys.forEach(function (bikeType) {
                                _return_[mode][bikeType] = 0;
                                Object.keys(times).forEach(function (trackId) {
                                    var timesOfMode = times[trackId][mode][bikeType],
                                        matches = JSON.stringify(timesOfMode).match(regexp);
                                    _return_[mode][bikeType] += parseInt(matches ? matches.length : 0, 10);
                                });
                            });
                        });

                        return _return_;
                    }
                };

            return thisScope;
        })