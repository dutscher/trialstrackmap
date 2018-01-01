angular.module("trialsTrackmap")
    .controller("trackFinder", function ($rootScope, urlHandler, trackData) {
        $rootScope.findTrack = urlHandler.get("track");

        $rootScope.$on("data:loaded", function () {
            var foundedTrack = trackData.getTrackByName($rootScope.findTrack);
            if (foundedTrack.length > 0 && foundedTrack[0].hasOwnProperty("coords")) {
                $rootScope.$emit("paintTrack", {
                    world: foundedTrack[0].world,
                    coords: foundedTrack[0].coords
                });
            }
        });
    });