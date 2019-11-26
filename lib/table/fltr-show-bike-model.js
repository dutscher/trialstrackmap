angular.module("trialsTrackmap")
    .filter("showBikeModel", function (improveTimes) {
        return function (array, selectedBikeModel) {
            if (!array) {
                return array;
            }

            if (selectedBikeModel) {
                var os = improveTimes.getOS(),
                    bikeType = improveTimes.getBikeType(),
                    bikeId;

                array = array.filter(function (trackData) {
                    if (trackData.times) {
                        bikeId = trackData.times.worldRecord[os][bikeType].bikeId;
                        if(bikeId && bikeId === selectedBikeModel) {
                            return true;
                        }
                    }
                    return false;
                });
            }
            return array;
        }
    })