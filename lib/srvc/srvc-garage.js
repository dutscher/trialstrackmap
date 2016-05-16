angular.module("trialsTrackmap")
    .service("garage", function () {
        var bikes = {},
            paintjobs = {};

        return {
            setAll: function (_bikes_, _paintjobs_) {
                bikes = _bikes_;
                paintjobs = _paintjobs_;
            },
            getBikeName: function (bikeId) {
                return bikes[bikeId].name;
            },
            getPaintjobName: function (bikeId, paintjobId) {
                if(paintjobs.bikes.hasOwnProperty(bikeId)){
                    return paintjobs.bikes[bikeId][paintjobId].name;
                } else {
                    console.log("now paintjob found", bikeId, paintjobId);
                }
            }
        }
    })