angular.module("trialsTrackmap")
    .directive("showTrackOnMap", function ($rootScope, trackData, canvas, debounce) {
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

                    element.bind("click", function (event) {
                        if ($rootScope.selectedWorld !== scope.data.track.world) {
                            canvas.clear("showTrackOnMap");
                            $rootScope.$emit("changeWorld", scope.data.track.world);
                            event.stopPropagation();
                            event.preventDefault();
                            return;
                        }

                        canvas.handleShowTrackOnMap(scope.data.track);
                        event.stopPropagation();
                        event.preventDefault();
                    });

                    function drawTrack () {
                        var showOnMap = scope.data.track.showOnMap;

                        if (showOnMap) {
                            canvas.handleShowTrackOnMap(scope.data.track, true);
                        }
                    }

                    var drawTrackReally = debounce(drawTrack, 1000, false);

                    $rootScope.$on("world:ready", function () {
                        drawTrackReally();
                    });
                }
            };
        }
    );