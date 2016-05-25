angular.module("trialsTrackmap")
    .service("garage", function () {
        var bikes = {},
            paintjobs = {};

        return {
            setAll: function (_bikes_, _paintjobs_) {
                bikes = _bikes_;
                paintjobs = _paintjobs_;
            },
            getBikeName: function (bikeId, newData) {
                var bike = bikes[bikeId];

                if (!bike) {
                    //console.log("bike found", bikeId, newData);
                    return "";
                }

                return bikes[bikeId].name;
            },
            getPaintjobName: function (bikeId, paintjobId) {
                if (!paintjobs.bikes.hasOwnProperty(bikeId)) {
                    //console.log("no paintjob found", bikeId, paintjobId);
                    return "";
                }

                return paintjobs.bikes[bikeId][paintjobId].name;
            }
        }
    })