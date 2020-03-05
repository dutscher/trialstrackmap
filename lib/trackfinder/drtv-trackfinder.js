angular.module("trialsTrackmap")
    .directive("trackfinder", function ($rootScope) {
        return {
            restrict: "C",
            template: '\
                <span class="trackfinder__name" ng-hide="iframeView">#{%::world%} {%::worldName%} ({%trackCount%})</span>\
                <canvas class="trackfinder__pointer"></canvas> \
                <img hide-me-on-pan="" src="blank.png" class="trackfinder__links" usemap="#trackfinder--{%::world%}">\
                <img class="trackfinder__world" ng-src="{% src %}" />\
                <map ng-if="!iframeView" name="trackfinder--{%::world%}" trackfinder-links></map>\
            ',
            scope: true,
            link: function (scope, element, params) {
                var dimMap = params.dimMap.split("x"),
                    dimPath = params.dimPath.split("x"),
                    isIframeView = scope.iframeView,
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
                scope.worldName = params.worldName;
                scope.trackCount = 0;
                // set canvas dim
                $canvas.attr({
                    width: dimPath[0],
                    height: dimPath[1]
                });

                // wait for data loaded
                $rootScope.$on("clearPainter", function () {
                    ctx.clearRect(0, 0, dimPath[0], dimPath[1]);
                    scope.trackCount = 0;

                    $rootScope.$emit("clearAreaLinks");
                });

                $rootScope.$on("paintTrack", function (event, track) {
                    if (parseInt(track.world) === parseInt(params.world) && track.coords) {
                        scope.trackCount++;

                        var trackCoords = track.coords.split(","),
                            i18n = track.track.i18n,
                            // scale down the coords
                            scaledCoords = {
                                centerX: parseInt(Math.round(trackCoords[0] / scale)),
                                centerY: parseInt(Math.round(trackCoords[1] / scale) + 6),
                                radius:
                                    isIframeView
                                        ? parseInt(Math.round(80 / scale) * 1.5)
                                        : parseInt(Math.round(80 / scale) / 2)
                            },
                            textWidth = ctx.measureText(i18n).width + 12,
                            isRtl = scaledCoords.centerX + textWidth + 5 > dimPath[0];

                        if (isIframeView) {
                            paintMarkerWithoutText(scaledCoords, track);
                        // dot with text to near at the border, revert it to text dot
                        } else if (!isRtl) {
                            // O Text )
                            paintMarkerDotText(scaledCoords, textWidth, i18n, track);
                        } else {
                            // ( Text O
                            paintMarkerTextDot(scaledCoords, textWidth, i18n, track);
                        }

                        if (!isIframeView) {
                            // set link on area map
                            $rootScope.$emit("createAreaLink", {
                                title: i18n,
                                href: track.track.oid,
                                coords:
                                    !isRtl ? (
                                        // O Text )
                                        (scaledCoords.centerX - scaledCoords.radius)
                                        + "," + (scaledCoords.centerY - scaledCoords.radius)
                                        + "," + (scaledCoords.centerX + textWidth)
                                        + "," + (scaledCoords.centerY + (scaledCoords.radius * 2))
                                    ) : (
                                        // ( Text O
                                        (scaledCoords.centerX - scaledCoords.radius - textWidth)
                                        + "," + (scaledCoords.centerY - scaledCoords.radius)
                                        + "," + (scaledCoords.centerX + scaledCoords.radius)
                                        + "," + (scaledCoords.centerY + (scaledCoords.radius * 2))
                                    ),
                            });
                        }
                    }
                });

                // O
                function paintMarkerWithoutText(scaledCoords, track){
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
                    ctx.globalAlpha = 1;
                    ctx.lineWidth = 10;
                    ctx.strokeStyle = "#ff0000";
                    ctx.stroke();
                    ctx.closePath();
                    ctx.fill();
                }

                // O Trackname )
                function paintMarkerDotText(scaledCoords, textWidth, i18n, track) {
                    // round edge
                    ctx.beginPath();
                    ctx.fillStyle = "#fff";
                    ctx.arc(
                        scaledCoords.centerX + textWidth - 5,
                        scaledCoords.centerY,
                        scaledCoords.radius + 2,
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

                // ( Trackname O
                function paintMarkerTextDot(scaledCoords, textWidth, i18n, track) {
                    // round edge
                    ctx.beginPath();
                    ctx.fillStyle = "#fff";
                    ctx.arc(
                        scaledCoords.centerX - textWidth + 2,
                        scaledCoords.centerY,
                        scaledCoords.radius + 2,
                        0,
                        2 * Math.PI,
                        true);
                    ctx.closePath();
                    ctx.fill();
                    // trackname rect
                    ctx.fillStyle = "white";
                    ctx.fillRect(
                        scaledCoords.centerX - textWidth + 5,
                        scaledCoords.centerY - 7,
                        textWidth - 5,
                        14);
                    ctx.fillStyle = "black";
                    ctx.font = "10px sans-serif";
                    ctx.fillText(
                        i18n,
                        scaledCoords.centerX - textWidth,
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
            }
        };
    })
