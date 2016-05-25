angular.module("trialsTrackmap")
    .filter("improveSorter", function (improveTimes) {

        // Less than 0: Sort "a" to be a lower index than "b"
        // Zero: "a" and "b" should be considered equal, and no sorting performed.
        // Greater than 0: Sort "b" to be a lower index than "a".

        function checkImprove(a, b, sortType, mode, bikeType) {
            // a has no data b got higher
            if (!(sortType in a.improve[mode][bikeType])
                && sortType in b.improve[mode][bikeType]) {
                return -1;
                // b has no data a get higher
            } else if (!(sortType in b.improve[mode][bikeType])
                && sortType in a.improve[mode][bikeType]) {
                return 1;
            } else if (!(sortType in a.improve[mode][bikeType]
                && sortType in b.improve[mode][bikeType])) {
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
                        mode = improveTimes.getMode(),
                        bikeType = improveTimes.getBikeType();

                    // filter all entries with data and empty seperate in extra array
                    array = array.filter(function (track) {
                        var _return_ = true;

                        switch (sortType) {
                            case "myRank":
                                _return_ = "improve" in track
                                    && track.improve[mode][bikeType].myRank !== error;
                                break;
                            case "differenceTime":
                            case "differenceTimeMyGoal":
                            case "differenceTimeWR":
                                _return_ = "improve" in track
                                    && sortType in track.improve[mode][bikeType]
                                    && track.improve[mode][bikeType][sortType] !== "";
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
                                _return_ = checkImprove(a, b, sortType, mode, bikeType);
                                if (_return_ !== null) {
                                    return _return_;
                                }

                                x = a.improve[mode][bikeType][sortType];
                                y = b.improve[mode][bikeType][sortType];

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

                                x = parseInt(a.improve[mode][bikeType][sortType]);
                                y = parseInt(b.improve[mode][bikeType][sortType]);
                                break;
                            case "differenceTime":
                            case "differenceTimeMyGoal":
                            case "differenceTimeWR":
                            case "ultimate":
                                // no improve to compare
                                if(!a.hasOwnProperty("improve") || !b.hasOwnProperty("improve") ) {
                                    return -1;
                                }

                                _return_ = checkImprove(a, b, sortType, mode, bikeType);
                                if (_return_ !== null) {
                                    return _return_;
                                }

                                // both have not data
                                if (!(sortType in a.improve[mode][bikeType])
                                    || a.improve[mode][bikeType][sortType] === ""
                                    || !(sortType in b.improve[mode][bikeType])
                                    || b.improve[mode][bikeType][sortType] === ""
                                ) {
                                    return -1;
                                }

                                var key = "time";
                                if (sortType === "ultimate") {
                                    key = "score";
                                }

                                if (!(key in a.improve[mode][bikeType][sortType]
                                    && key in b.improve[mode][bikeType][sortType])) {
                                    return 0;
                                    // compare each other
                                } else {
                                    x = a.improve[mode][bikeType][sortType][key];
                                    y = b.improve[mode][bikeType][sortType][key];
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