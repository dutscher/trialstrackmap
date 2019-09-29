angular.module("trialsTrackmap")
    .service("garage", function () {
        var bikes = {};

        return {
            setAll: function (_bikes_) {
                bikes = _bikes_;
            },
            getBikeName: function (bikeId) {
                var bike;
                if (bikes && bikeId) {
                    bike = bikes[bikeId];
                }
                if (!bike) {
                    return "";
                }

                return bikes[bikeId].name;
            },
            getPaintjobName: function (bikeId, paintjobId) {
                if (!bikes.hasOwnProperty(bikeId) || !bikes[bikeId].paintjobs.hasOwnProperty(paintjobId)) {
                    //console.log("no paintjob found", bikeId, paintjobId);
                    return "";
                }

                return bikes[bikeId].paintjobs[paintjobId];
            }
        }
    })