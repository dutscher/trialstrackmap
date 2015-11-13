angular.module("trialsTrackmap")
    .service("improveTimes", function (localStorageService, $filter) {
        var identifier = "times",
            mode = "",
            bike = "",
            error = "?!?",
            empty = "??????",
            times = {},
            scope,
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
                "myTime-ios-crazy": 11
            },
            modes = {
                "android": "Android",
                "ios": "iOS"
            },
            bikes = {
                "normal": "Normal",
                "donkey": "Donkey",
                "crazy": "Crazy"
            },
            modeKeys = Object.keys(modes),
            bikesKeys = Object.keys(bikes),
            emptyEntry = Array(Object.keys(pattern).length).join(",").split(","),
            base64Regexp = "^(data:(.*?);?base64,)(.*)$";

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

        function humanReadableDate(timestamp) {
            var date = timestamp ? new Date(timestamp) : new Date(),
                dateValues = [
                    date.getFullYear(),
                    pad(date.getMonth() + 1, 2),
                    pad(date.getDate(), 2),
                    ".",
                    pad(date.getHours(), 2),
                    pad(date.getMinutes(), 2),
                    pad(date.getSeconds(), 2)
                ];
            return dateValues.join("");
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

            return time;
        }

        function clearBase64(b64Data) {
            if (typeof b64Data != "string")
                return '';

            var clearedBase64 = b64Data
                .replace(/\r?\n|\r| /g, "")
                .replace(new RegExp(base64Regexp, "i"), function () {
                    return arguments[3];// return the cleared base64
                });
            return clearedBase64;
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

        return {
            fileName: "trialsFrontierImproveData",
            fileMimeType: "application/json",
            fileExtension: "json",
            //fileMimeType: "text/plain",
            //fileExtension: "txt",
            error: error,
            setScope: function (_scope_) {
                scope = _scope_;
                return this;
            },
            setMode: function (_mode_) {
                mode = _mode_;
            },
            getMode: function () {
                return mode;
            },
            setBike: function (_bike_) {
                bike = _bike_;
            },
            getBike: function () {
                return bike;
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
                    initData = {},
                    thisScope = this;

                if (!trackData) {
                    console.error("trackData missing");
                    return false;
                }

                modeKeys.forEach(function (_mode_) {
                    initData[_mode_] = {};
                    bikesKeys.forEach(function (_bike_) {
                        initData[_mode_][_bike_] = {};

                        // set myRank and myTime
                        keys.forEach(function (key, index) {
                            // skip wrong mode
                            if (key.indexOf(_mode_) === -1) {
                                return;
                            }
                            // skip wrong bike
                            if (key.indexOf(_bike_) === -1) {
                                return;
                            }

                            var clearKey = key.replace(/(-\w.*)/g, "");

                            if (data === error || data[index] === "" || !data[index]) {
                                initData[_mode_][_bike_][clearKey] = (clearKey === "myRank") ? error : "";
                            } else {
                                initData[_mode_][_bike_][clearKey] = data[index];
                            }
                        });

                        // difference myTime to worldRecord
                        if (initData[_mode_][_bike_].myTime !== error
                            && trackData.times.worldRecord[_mode_][_bike_].time !== error) {
                            initData[_mode_][_bike_].differenceTime = thisScope.compareTime(initData[_mode_][_bike_].myTime, trackData.times.worldRecord[_mode_][_bike_].time);
                        }

                        // difference worldRecord to platinumTime
                        if (trackData.times.worldRecord[_mode_][_bike_].time !== error) {
                            initData[_mode_][_bike_].differenceTimeWR = thisScope.compareTime(trackData.times.worldRecord[_mode_][_bike_].time, trackData.times.platinum.time);
                        }
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
            update: function (_type_, trackId, value) {
                var data = this.getOneByType("all", trackId),
                    type = _type_ + "-" + mode + "-" + bike;

                // first entry
                if (data === error) {
                    data = angular.extend([], emptyEntry);
                    // migrate old to new pattern
                } else if (data.length < Object.keys(pattern).length) {
                    var empty = angular.extend([], emptyEntry);
                    empty.forEach(function (value, index) {
                        if (index in data) {
                            empty[index] = data[index];
                        }
                    });
                    data = empty;
                }

                // parse to valid times
                var _value_ = clearTime(value);
                data[pattern[type]] = _value_ !== 0 ? _value_ : "";

                // save
                times[trackId] = data.join("|");
                localStorageService.set(identifier, times);
                this.getAll(true);

                if (scope && "track" in scope) {
                    scope.track.improve = this.getOne(trackId, scope.track);
                    scope.$apply();
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
                    calcedTime = firstTime - secondTime,
                    returnObj = {
                        prefix: isBetter ? "+" : "-",
                        time: !isBetter ? calcedTime * -1 : calcedTime
                    };

                return returnObj;
            },
            convertTime: function (_time_, showZero) {
                if (_time_ === error || !_time_ && !showZero) {
                    _time_ = empty;
                }
                return convertTime(_time_);
            },
            clearTime: clearTime,
            pad: pad,
            humanReadableDate: humanReadableDate,

            validateFile: function (base64, file) {
                var json = "",
                    data = {};

                try {
                    json = window.atob(clearBase64(base64));
                } catch (e) {
                    console.error("error due reading import file :" + e, file);
                    return;
                }

                try {
                    data = JSON.parse(json);
                } catch (e) {
                    console.error("error due parsing import file :" + e, file);
                    return;
                }

                if (file.name.indexOf(this.fileName) === -1) {
                    console.error("wrong filename for import! must contain '" + this.fileName + "'", file);
                    return;
                }

                if (file.type !== "" && file.type !== this.fileMimeType) {
                    console.error("your file has the wrong type! it must be '" + this.fileMimeType + "'", file);
                    return;
                }

                if ((file.lastModified - data.date) > 50000) {
                    console.error("your file was edited extern!");
                    return;
                }

                this.confirmImport(data);
            },
            confirmImport: function (data) {
                if (!("times" in data)) {
                    console.error("no times in import data!", data);
                    return;
                }

                var boolean = confirm(
                    $filter("translate")("page.timesTable.improve.confirmImport")
                    + " "
                    + this.humanReadableDate(data.date)
                    + "?"
                );

                if (boolean) {
                    if (this.importTimes(data.times)) {
                        alert($filter("translate")("page.timesTable.improve.successfullImport"));
                    }
                }
            },
            importTimes: function (_times_) {
                var thisScope = this;
                times = _times_;
                localStorageService.set(identifier, times);
                this.getAll(true);

                if (scope && "data" in scope && "tracks" in scope.data) {
                    scope.data.tracks.forEach(function (track) {
                        var trackId = track.id;
                        // improve time
                        track.improve = thisScope.getOne(trackId, track);
                    });
                    scope.$apply();
                    return true;
                }
                return false;
            }
        }
    })