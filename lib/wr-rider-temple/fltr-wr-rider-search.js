angular.module("trialsTrackmap")
    .filter("WRRiderSearch", function () {
        return function (riderObject, riderName, returnArray) {
            var _return_ = riderObject;

            if(riderObject && riderName) {
                _return_ = !returnArray ? {} : [];
                Object.keys(riderObject).forEach(function (riderId) {
                    var rider = riderObject[riderId];
                    if (rider.riderName.toLowerCase().indexOf(riderName.toLowerCase()) !== -1) {
                        if(!returnArray) {
                            _return_[riderId] = rider;
                        } else {
                            _return_.push(rider);
                        }
                    }
                });
            }

            return _return_;
        }
    })