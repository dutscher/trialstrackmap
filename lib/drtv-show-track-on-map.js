angular.module("trialsTrackmap")
    .directive("showTrackOnMap", function (categories, $rootScope) {
        return {
            restrict: "A",
            scope: {
                data: "=showTrackOnMap"
            },
            link: function (scope, element) {
                var canvas = document.querySelector("canvas"),
                    ctx = canvas ? canvas.getContext("2d") : null;

                if (ctx === null) {
                    return;
                }

                function showTrackOnMap() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    var cat = categories.findByName(scope.data.catClass),
                        color = "#" + (cat ? cat.color : "fce195"),
                        coords = scope.data.track.coords.split(","),
                        centerX = parseInt(coords[0]),
                        centerY = parseInt(coords[1]),
                        radius = parseInt(coords[2]);

                    $rootScope.$emit("map.panTo", centerX, centerY);

                    ctx.beginPath();
                    // circle
                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
                    ctx.globalAlpha = 0.2;
                    ctx.fillStyle = color;
                    ctx.closePath();
                    ctx.fill();

                    // circle border
                    ctx.globalAlpha = 1;
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = color;
                    ctx.stroke();
                }
                // mouseenter not works because of touch emulator
                element.bind("click", function () {
                    showTrackOnMap();
                });
            }
        }
    })