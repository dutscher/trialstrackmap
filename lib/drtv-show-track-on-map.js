angular.module("trialsTrackmap")
    .directive("showTrackOnMap", function ($rootScope, $timeout) {
        return {
            restrict: "A",
            scope: {
                data: "=showTrackOnMap"
            },
            link: function (scope, element) {
                var canvas = document.querySelector("canvas"),
                    ctx = canvas ? canvas.getContext("2d") : null,
                    timeout = null;

                if (ctx === null || !scope.data.track.coords) {
                    return;
                }

                function clearCanvas(){
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }

                function showTrackOnMap() {
                    clearCanvas();

                    if($rootScope.selectedWorld !== scope.data.track.world){
                        $rootScope.$emit("ferry.panTo");
                        return;
                    }

                    var color = "#fce195",
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

                // mouseenter not works because of touch emulator
                element.bind("mouseover", function () {
                    $rootScope.$emit("showOnMap:eliminateOther");
                    timeout = $timeout(function () {
                        showTrackOnMap();
                    }, 150);
                });

                $rootScope.$on("showOnMap:eliminateOther", function () {
                    $timeout.cancel(timeout);
                });

                element.bind("click", function () {
                    showTrackOnMap();
                });

                $rootScope.$on("world:changed", function (event, newWorld) {
                    clearCanvas();
                });
            }
        }
    })