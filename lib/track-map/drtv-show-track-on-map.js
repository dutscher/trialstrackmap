angular.module("trialsTrackmap")
    .directive("showTrackOnMap", function ($rootScope, trackData) {
        return {
            restrict: "A",
            scope: {
                data: "=showTrackOnMap"
            },
            link: function (scope, element) {
                var canvas = document.querySelector("canvas"),
                    ctx = canvas ? canvas.getContext("2d") : null;

                if (ctx === null || !scope.data.track.coords || scope.data.track.leaked) {
                    element.addClass("inactive");
                    return;
                }

                if (scope.data.track.world !== trackData.getWorld()) {
                    element.addClass("other-world");
                }

                function clearCanvas() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                function showTrackOnMap(showForSearch) {
                    if (!showForSearch) {
                        clearCanvas();
                    }

                    if ($rootScope.selectedWorld !== scope.data.track.world) {
                        $rootScope.$emit("ferry.panTo");
                        return;
                    }

                    var color = showForSearch ? "#ff0000" : "#fce195",
                        coords = scope.data.track.coords.split(","),
                        centerX = parseInt(coords[0]),
                        centerY = parseInt(coords[1]),
                        radius = parseInt(coords[2]);

                    $rootScope.$emit("map.panTo", centerX, centerY);

                    ctx.beginPath();
                    // circle
                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);

                    // circle border
                    ctx.globalAlpha = 0.9;
                    ctx.lineWidth = 10;
                    ctx.strokeStyle = color;
                    ctx.stroke();
                }

                element.bind("click", function (event) {
                    showTrackOnMap();
                    event.stopPropagation();
                    event.preventDefault();
                });

                $rootScope.$on("world:changed", function () {
                    clearCanvas();
                });

                if (scope.data.track.showOnMap) {
                    showTrackOnMap(true);
                }
            }
        }
    }
)