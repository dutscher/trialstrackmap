angular.module("trialsTrackmap")
    .filter("WRRiderSort", function (improveTimes) {
        return function (riderObject) {
            var _return_ = riderObject;

            if(riderObject) {
                _return_ = [];
                var tail = [],
                    modes = improveTimes.getModes(true),
                    bikes = improveTimes.getBikes(true);


                Object.keys(riderObject).forEach(function (riderId) {
                    var rider = riderObject[riderId],
                        allEmpty = true;

                    modes.forEach(function(mode){
                        bikes.forEach(function(bike){
                            var amount = rider.WRAmount[mode][bike];
                            if(amount !== 0){
                                allEmpty = false;
                            }
                        });
                    });

                    if (!allEmpty) {
                        _return_.push(rider);
                    } else {
                        tail.push(rider);
                    }
                });

                _return_ = _return_.concat(tail);
            }

            return _return_;
        }
    })