angular.module("trialsTrackmap")
    .directive("trackpainter", function ($rootScope, $parse) {
        return {
            restrict: "C",
            template: '\
                <canvas class="trackpainter__pointer"></canvas> \
                <img class="trackpainter__world" src="{%src%}" />\
            ',
            scope: true,
            link: function (scope, element, attrs) {
                var params = attrs,
                    dimMap = params.dimMap.split("x"),
                    dimPath = params.dimPath.split("x"),
                    scale = dimMap[0] / dimPath[0],
                    $canvas = angular.element(element.find("canvas")),
                    ctx = $canvas[0] ? $canvas[0].getContext("2d") : null;

                scope.src = attrs.src;

                $canvas.attr({
                    width: dimPath[0],
                    height: dimPath[1]
                });

                $rootScope.$on("paintTrack", function (event, track) {
                    if (parseInt(track.world) === parseInt(params.world)) {
                        var trackCoords = track.coords.split(","),
                            // scale down the coords
                            scaledCoords = {
                                centerX: Math.round(trackCoords[0] / scale),
                                centerY: Math.round(trackCoords[1] / scale) + 10,
                                radius: Math.round(trackCoords[2] / scale)
                            };

                        console.log(trackCoords, scaledCoords);

                        ctx.beginPath();
                        // circle
                        ctx.arc(parseInt(scaledCoords.centerX), parseInt(scaledCoords.centerY), parseInt(scaledCoords.radius), 0, 2 * Math.PI, true);
                        ctx.fillStyle = "#ff0000";
                        ctx.closePath();
                        ctx.fill();
                    }
                });
            }
        }
    });