angular.module("trialsTrackmap")
    .filter("improveSorter", function (improveTimes) {

        // Less than 0: Sort "a" to be a lower index than "b"
        // Zero: "a" and "b" should be considered equal, and no sorting performed.
        // Greater than 0: Sort "b" to be a lower index than "a".

        function checkImprove(a, b, sortType, os, bikeType) {

            if (!(os in a.improve)) {
                console.log("no improve found in a", JSON.stringify(a.improve));
                return 0;
            } else if (!(os in b.improve)) {
                console.log("no improve found in  b", JSON.stringify(b.improve));
                return 0;
            }

            // a has no data b got higher
            if (!(sortType in a.improve[os][bikeType])
                && sortType in b.improve[os][bikeType]) {
                return -1;
                // b has no data a get higher
            } else if (!(sortType in b.improve[os][bikeType])
                && sortType in a.improve[os][bikeType]) {
                return 1;
            } else if (!(sortType in a.improve[os][bikeType]
                && sortType in b.improve[os][bikeType])) {
                return 0;
            }

            return null;
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

        return function (array, sortDirection, sortType) {
            if (array) {

                array = array.filter(function (track) {
                    // exclude special tracks
                    if ("leaked" in track && track.leaked
                        || "only_event" in track && track.only_event) {
                        return false;
                    } else {
                        return true;
                    }
                });

                if (sortDirection && sortType) {

                    var error = improveTimes.error,
                        tailOfSortedArray = [],
                        os = improveTimes.getOS(),
                        bikeType = improveTimes.getBikeType();

                    // filter all entries with data and empty seperate in extra array
                    array = array.filter(function (track) {
                        var _return_ = true;

                        switch (sortType) {
                            case "myRank":
                                _return_ = "improve" in track
                                    && track.improve[os][bikeType].myRank !== error;
                                break;
                            case "myRankPercent":
                            case "differenceTime":
                            case "differenceTimeMyGoal":
                            case "differenceTimeWR":
                                _return_ = "improve" in track
                                    && sortType in track.improve[os][bikeType]
                                    && track.improve[os][bikeType][sortType] !== "";
                                break;
                        }

                        if (!_return_) {
                            tailOfSortedArray.push(track);
                        }

                        return _return_;
                    });

                    // compare entries with data
                    array.sort(function (a, b) {
                        var x, y, _return_;

                        switch (sortType) {
                            case "catIndex":
                            case "id":
                            case "tier":
                                x = a[sortType];
                                y = b[sortType];
                                break;
                            case "trackName":
                                x = a.i18n;
                                y = b.i18n;
                                break;
                            case "myRank":
                            case "myRankPercent":
                                _return_ = checkImprove(a, b, sortType, os, bikeType);
                                if (_return_ !== null) {
                                    return _return_;
                                }

                                x = a.improve[os][bikeType][sortType];
                                y = b.improve[os][bikeType][sortType];

                                if (x === error
                                    || x === error
                                    && y !== error) {
                                    return -1;
                                } else if (x !== error
                                    && y === error) {
                                    return 1;
                                } else if (x === error
                                    && y === error) {
                                    return 0;
                                }

                                if(sortType === "myRank") {
                                    x = parseInt(a.improve[os][bikeType][sortType]);
                                    y = parseInt(b.improve[os][bikeType][sortType]);
                                } else {
                                    x = parseFloat(a.improve[os][bikeType][sortType]);
                                    y = parseFloat(b.improve[os][bikeType][sortType]);
                                }
                                break;
                            case "differenceTime":
                            case "differenceTimeMyGoal":
                            case "differenceTimeWR":
                            case "ultimate":
                                // no improve to compare
                                if (!a.hasOwnProperty("improve") || !b.hasOwnProperty("improve")) {
                                    return -1;
                                }

                                _return_ = checkImprove(a, b, sortType, os, bikeType);
                                if (_return_ !== null) {
                                    return _return_;
                                }

                                // both have not data
                                if (!(sortType in a.improve[os][bikeType])
                                    || a.improve[os][bikeType][sortType] === ""
                                    || !(sortType in b.improve[os][bikeType])
                                    || b.improve[os][bikeType][sortType] === ""
                                ) {
                                    return -1;
                                }

                                var key = "time";
                                if (sortType === "ultimate") {
                                    key = "score";
                                }

                                if (!(key in a.improve[os][bikeType][sortType]
                                    && key in b.improve[os][bikeType][sortType])) {
                                    return 0;
                                    // compare each other
                                } else {
                                    x = a.improve[os][bikeType][sortType][key];
                                    y = b.improve[os][bikeType][sortType][key];
                                }
                                break;
                        }

                        return sortArray(x, y);
                    });

                    if (sortDirection === "asc") {
                        array.reverse();
                    }

                    // add empty at the end
                    array = array.concat(tailOfSortedArray);
                }
            }

            return array;
        }
    })