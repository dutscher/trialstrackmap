angular.module("trialsTrackmap")
    .directive("showTrackOnMap", function (categories) {
        return {
            restrict: "A",
            scope: {
                data: "=showTrackOnMap"
            },
            link: function (scope, element) {
                var canvas = document.querySelector("canvas");
                var ctx = canvas.getContext("2d");

                function showTrackOnMap() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    if (!scope.data.track.genCoords)
                        return false;

                    var cat = categories.findByName(scope.data.catClass),
                        color = "#" + (cat ? cat.color : "fce195"),
                        coords = scope.data.track.genCoords.split(","),
                        centerX = parseInt(coords[0]),
                        centerY = parseInt(coords[1]),
                        radius = parseInt(coords[2]) + 10;

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

                element.bind("mouseenter click", function () {
                    showTrackOnMap();
                });
            }
        }
    })