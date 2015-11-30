angular.module("trialsTrackmap")
    .directive("showTrackOnMap", function ($rootScope) {
        return {
            restrict: "A",
            scope: {
                data: "=showTrackOnMap"
            },
            link: function (scope, element) {
                var canvas = document.querySelector("canvas"),
                    ctx = canvas ? canvas.getContext("2d") : null;

                if (ctx === null || !scope.data.track.coords) {
                    return;
                }

                function showTrackOnMap() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
                element.bind("mouseover click", function () {
                    showTrackOnMap();
                });
            }
        }
    })