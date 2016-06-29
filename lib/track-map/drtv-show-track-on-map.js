angular.module("trialsTrackmap")
    .directive("showTrackOnMap", function ($rootScope, trackData, canvas) {
        return {
            restrict: "A",
            scope: {
                data: "=showTrackOnMap"
            },
            link: function (scope, element) {
                if (!canvas.exists() || !scope.data.track.coords || scope.data.track.leaked) {
                    element.addClass("inactive");
                    return;
                }

                if (scope.data.track.world !== trackData.getWorld()) {
                    element.addClass("other-world");
                }


                function showTrackOnMap(showForSearch) {
                    if (!showForSearch) {
                        canvas.clear();
                    }

                    if ($rootScope.selectedWorld !== scope.data.track.world) {
                        $rootScope.$emit("ferry.panTo");
                        return;
                    }

                    var color = showForSearch ? "ff0000" : "fce195",
                        coords = scope.data.track.coords.split(","),
                        centerX = parseInt(coords[0]),
                        centerY = parseInt(coords[1]);

                    $rootScope.$emit("map.panTo", centerX, centerY);

                    canvas.drawTrack(scope.data.track.coords, color);
                }

                element.bind("click", function (event) {
                    showTrackOnMap();
                    event.stopPropagation();
                    event.preventDefault();
                });

                $rootScope.$on("world:changed", function () {
                    canvas.clear();
                });

                if (scope.data.track.showOnMap) {
                    showTrackOnMap(true);
                }
            }
        }
    }
)