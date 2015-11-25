angular.module("trialsTrackmap")
    .service("WRTimes", function (myJson, $q, $rootScope, $filter, $timeout) {

        var scope,
            riderRaw = null,
            rider = {},
            timesRaw = null,
            times = {},
            timesStr = "",
            timesStrWithoutIDs = "",
            modes = {},
            modeKeys = [],
            bikes = {},
            bikeKeys = [],
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
                    bikes = this.improveTimes.getBikes();
                    bikeKeys = Object.keys(bikes);
                    // create default
                    defaultWR = {};
                    modeKeys.forEach(function (mode) {
                        defaultModes[mode] = {};
                        defaultWR[mode] = {};
                        bikeKeys.forEach(function (bike) {
                            defaultWR[mode][bike] = {
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

            reload: function(){
                return myJson.getWRData().then(function(_data_){
                    return _data_;
                });
            },

            get: function (forceUpdate) {
                if (!forceUpdate && Object.keys(times).length > 0) {
                    var deferred = $q.defer();
                    deferred.resolve(times);
                    return deferred.promise;
                }
                // add public worldrecord data
                return this.reload().then(function (_data_) {
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
                        bikeKeys.forEach(function (bike) {
                            var raw = worldRecords[pattern[mode + "-" + bike]],
                                rawArr = raw.split(":");

                            times[trackId][mode][bike] = {
                                riderId: rawArr[0],
                                riderName: thisScope.getRiderNameByID(rawArr[0]),
                                time: rawArr[1]
                            };
                        });
                    });
                });

                return times;
            },

            save: function(trackId, riderId, newTime){
                return this.reload().then(function (_data_) {
                    var allTimes = _data_.times,
                        trackTimes = allTimes[trackId] ? allTimes[trackId].split("|") : Array(Object.keys(pattern).length).join(",").split(","),
                        mode = thisScope.improveTimes.getMode(),
                        bike = thisScope.improveTimes.getBike();

                    // update mode and bike time
                    trackTimes[pattern[mode + "-" + bike]] = riderId + ":" + newTime;
                    // revert to database style
                    allTimes[trackId] = trackTimes.join("|");
                    // revert all the data
                    _data_.times = allTimes;

                    // update online
                    return myJson.setWRData(_data_).then(function(){
                        thisScope.set(_data_);
                        if(scope) {
                            $timeout(function () {
                                scope.$apply();
                                $rootScope.$emit("data:reload");
                            }, 0);
                        }
                    });
                });
            },

            resave: function(trackId, riderId, newTime){
                var allTimes = resave && "times" in resave ? resave.times : timesRaw,
                    trackTimes = allTimes[trackId] ? allTimes[trackId].split("|") : Array(Object.keys(pattern).length).join(",").split(","),
                    mode = thisScope.improveTimes.getMode(),
                    bike = thisScope.improveTimes.getBike();

                // update mode and bike time
                trackTimes[pattern[mode + "-" + bike]] = riderId + ":" + newTime;
                // revert to database style
                allTimes[trackId] = trackTimes.join("|");
                // revert all the data
                if(!resave) {
                    resave = {times:timesRaw,rider:riderRaw};
                }
                resave.times = allTimes;
            },

            resaveData: function(){
                console.log(resave)
                //myJson.setWRData(resave);
            },

            getWROfTrack: function(trackId){
                var mode = this.improveTimes.getMode(),
                    bike = this.improveTimes.getBike();

                return trackId in times ? times[trackId][mode][bike] : {};
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

            addRider: function(riderName, _data_){
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
                    bikeKeys.forEach(function(bike){
                        _return_[mode][bike] = 0;
                        Object.keys(times).forEach(function (trackId){
                            var timesOfMode = times[trackId][mode][bike],
                                matches = JSON.stringify(timesOfMode).match(regexp);
                            _return_[mode][bike]+= parseInt(matches ? matches.length : 0, 10);
                        });
                    });
                });

                //console.log(_return_, riderId, regexp, timesStrWithoutIDs)

                return _return_;
            }
        };

        return thisScope;
    })