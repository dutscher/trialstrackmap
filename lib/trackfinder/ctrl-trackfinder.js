angular.module("trialsTrackmap")
    .controller("trackFinder", function ($rootScope, $window, urlHandler, trackData) {
        function paintTrack () {
            var foundedTrack = trackData.getTrackByName(urlHandler.get("track"));
            if (foundedTrack.length > 0 && foundedTrack[0].hasOwnProperty("coords")) {
                $rootScope.$emit("paintTrack", {
                    world: foundedTrack[0].world,
                    coords: foundedTrack[0].coords,
                    track: foundedTrack[0]
                });
            } else {
                $rootScope.$emit("clearPainter");
            }
        }

        $window.addEventListener("hashchange", function () {
            paintTrack();
        }, false);

        $rootScope.$on("data:loaded", function () {
            paintTrack();
        });
    });