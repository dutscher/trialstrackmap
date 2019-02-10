angular.module("trialsTrackmap")
    .controller("trackFinder", function ($scope, $rootScope, $window, urlHandler, trackData) {

        urlHandler.setParams(["track", "showFilter"]);
        $scope.showFilter = urlHandler.get("showFilter") || !urlHandler.get("track");
        $scope.searchTrack = urlHandler.get("track") || "";
        $scope.showMessage = "";
        $scope.clearSearch = function () {
            $scope.searchTrack = "";
        };

        function paintTrack() {
            $rootScope.$emit("clearPainter");

            var trackName = urlHandler.get("track"),
                foundedTracks = null;

            $scope.showMessage = "";
            // stop if searching via input
            if (trackName === "" && $scope.showFilter) {
                $rootScope.$emit("clearPainter");
                return true;
            } else {
                foundedTracks = trackData.getTrackByName(trackName);
            }

            if (foundedTracks.length > 0) {
                // maybe show message
                if (foundedTracks.length === 1) {
                    if (foundedTracks[0].only_bunker) {
                        $scope.showMessage = "Bunker only";
                        return;
                    }
                }
                // paint all founded tracks
                foundedTracks.map(function (track) {
                    $rootScope.$emit("paintTrack", {
                        world: track.world,
                        coords: track.coords,
                        track: track
                    });
                });
            } else {
                $rootScope.$emit("clearPainter");
            }
        }

        $window.addEventListener("hashchange", function () {
            $scope.$apply(function () {
                paintTrack();
            });
        }, false);

        $window.addEventListener("hashchangeAngular", function () {
            paintTrack();
        }, false);

        $rootScope.$on("data:loaded", function () {
            paintTrack();
            if ($scope.showFilter) {
                $scope.$watch("searchTrack", function (data) {
                    urlHandler.set({track: data, showFilter: true});
                });

                $rootScope.$on("$translateChangeSuccess", function () {
                    paintTrack();
                });
            }
        });
    });