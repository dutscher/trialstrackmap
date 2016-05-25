angular.module("trialsTrackmap")
    .directive("canvasPointer", function ($rootScope, $filter, $parse) {

        function setDimensions(scope, scopeData, world, canvas) {
            scope.dim = scopeData.images.trackmaps[world].dim.split("x");

            angular.element(canvas).css({
                "width": scope.dim[0] + "px",
                "height": scope.dim[1] + "px"
            });
        }

        function drawTracks(scope, canvas, ctx, onlyLabels, world) {
            canvas.setAttribute("width", scope.dim[0] + "px");
            canvas.setAttribute("height", scope.dim[1] + "px");

            if (!ctx) {
                return;
            }
            // clear infos
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            scope.tracks.forEach(function (track) {
                if (!("coords" in track) || track.coords == "" || track.world !== world) {
                    return;
                }

                var coords = track.coords.split(","),
                    centerX = parseInt(coords[0]),
                    centerY = parseInt(coords[1]),
                    radius = parseInt(coords[2]),
                    i18n = track.id + ". " + $filter("translate")("tracks." + track.id);

                if (!onlyLabels) {
                    // circle
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
                    ctx.globalAlpha = 0;
                    ctx.closePath();
                    ctx.fill();

                    // circle border
                    ctx.globalAlpha = 1;
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = "#000";
                    ctx.stroke();
                } else {
                    // coords rect
                    ctx.fillStyle = "white";
                    ctx.fillRect(centerX, centerY, ctx.measureText(i18n).width + 10, 20);
                    ctx.fillStyle = "black";
                    ctx.font = "12px sans-serif";

                    ctx.fillText(i18n, centerX + 5, centerY + 15);
                }
            });
        }

        return {
            restrict: "A",
            scope: true,
            link: function (scope, _canvas_, attrs) {
                var canvas = _canvas_[0],
                    ctx = "getContext" in canvas ? canvas.getContext("2d") : undefined,
                    scopeData,
                    world = $parse(attrs.world)(scope),
                    onlyLabels = $parse(attrs.onlyLabels)(scope),
                    onlyDimensions = $parse(attrs.onlyDimensions)(scope);

                // set only image dimensions to element
                if (onlyDimensions) {
                    $rootScope.$on("tracks:ready", function (event, data) {
                        scopeData = data;
                        setDimensions(scope, scopeData, world, canvas);
                    });

                    // set canvas actions
                    _canvas_.bind("mousedown", function (e) {
                        var coordX = parseInt(e.offsetX);
                        var coordY = parseInt(e.offsetY);
                        $rootScope.$broadcast("copyText", coordX + "," + coordY);
                    });

                    $rootScope.$on("world:changed", function (event, newWorld) {
                        if (newWorld) {
                            world = newWorld;
                            setDimensions(scope, scopeData, world, canvas);
                        }
                    });

                    return;
                }

                ///////////////////////////////////////////////

                scope.tracks = [];

                $rootScope.$on("tracks:ready", function (event, data) {
                    scopeData = data;
                    scope.tracks = scopeData.tracks;
                    scope.dim = scopeData.images.trackmaps[world].dim.split("x");
                    drawTracks(scope, canvas, ctx, onlyLabels, world);
                });

                $rootScope.$on("world:changed", function (event, newWorld) {
                    if (newWorld) {
                        world = newWorld;
                        scope.dim = scopeData.images.trackmaps[world].dim.split("x");
                        drawTracks(scope, canvas, ctx, onlyLabels, world);
                    }
                });
            }
        }
    })