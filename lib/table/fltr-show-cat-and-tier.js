angular.module("trialsTrackmap")
    .filter("showCatAndTier", function () {
        return function (array, selectedCat, selectedTier) {
            if(!array) {
                return array;
            }

            if (selectedCat || selectedTier) {
                array = array.filter(function (track) {
                    var cats = track.cats.split(",").map(Number);

                    if (!selectedTier
                        && selectedCat
                        && cats.indexOf(parseInt(selectedCat, 10)) >= 0
                        ||
                        selectedTier
                        && selectedCat
                        && track.tier === parseInt(selectedTier, 10)
                        && cats.indexOf(parseInt(selectedCat, 10)) >= 0
                        ||
                        selectedTier
                        && !selectedCat
                        && track.tier === parseInt(selectedTier, 10)
                    ) {
                        return true;
                    }

                    return false;
                });
            }
            return array;
        }
    })