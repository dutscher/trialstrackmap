angular.module("trialsTrackmap")
    .directive("trackpainter", function ($rootScope) {
        return {
            restrict: "C",
            template: "\
                <span class=\"trackpainter__name\">#{%world%}</span>\
                <canvas class=\"trackpainter__pointer\"></canvas> \
                <img class=\"trackpainter__world\" src=\"{%src%}\" />\
            ",
            scope: true,
            link: function (scope, element, params) {
                var dimMap = params.dimMap.split("x"),
                    dimPath = params.dimPath.split("x"),
                    scale = dimMap[0] / dimPath[0],
                    $canvas = angular.element(element.find("canvas")),
                    ctx = $canvas[0] ? $canvas[0].getContext("2d") : null,
                    tierColors = {
                        1: "#77a933",
                        2: "#db9c00",
                        3: "#d15f00"
                    };

                // add to scope
                scope.src = params.src;
                scope.world = params.world;
                // set canvas dim
                $canvas.attr({
                    width: dimPath[0],
                    height: dimPath[1]
                });

                // wait for data loaded
                $rootScope.$on("clearPainter", function () {
                    ctx.clearRect(0, 0, dimPath[0], dimPath[1]);
                });

                $rootScope.$on("paintTrack", function (event, track) {
                    // clear canvas
                    //ctx.clearRect(0, 0, dimPath[0], dimPath[1]);
                    if (parseInt(track.world) === parseInt(params.world) && track.coords) {
                        var trackCoords = track.coords.split(","),
                            i18n = track.track.i18n,
                            // scale down the coords
                            scaledCoords = {
                                centerX: parseInt(Math.round(trackCoords[0] / scale)),
                                centerY: parseInt(Math.round(trackCoords[1] / scale) + 6),
                                radius: parseInt(Math.round(trackCoords[2] / scale) / 2)
                            },
                            textWidth = ctx.measureText(i18n).width + 12;
                        // round edge
                        ctx.beginPath();
                        ctx.fillStyle = "#fff";
                        ctx.arc(
                            scaledCoords.centerX + textWidth - 5,
                            scaledCoords.centerY,
                            scaledCoords.radius + 2.5,
                            0,
                            2 * Math.PI,
                            true);
                        ctx.closePath();
                        ctx.fill();
                        // trackname rect
                        ctx.fillStyle = "white";
                        ctx.fillRect(
                            scaledCoords.centerX,
                            scaledCoords.centerY - 7,
                            textWidth - 5,
                            14);
                        ctx.fillStyle = "black";
                        ctx.font = "10px sans-serif";
                        ctx.fillText(
                            i18n,
                            scaledCoords.centerX + 8,
                            scaledCoords.centerY + 3);
                        // circle
                        ctx.beginPath();
                        ctx.fillStyle = tierColors[track.track.tier];
                        ctx.arc(
                            scaledCoords.centerX,
                            scaledCoords.centerY,
                            scaledCoords.radius,
                            0,
                            2 * Math.PI,
                            true);
                        // circle border
                        ctx.globalAlpha = 0.9;
                        ctx.lineWidth = 5;
                        ctx.strokeStyle = "#fff";
                        ctx.stroke();
                        ctx.closePath();
                        ctx.fill();
                    }
                });
            }
        };
    });