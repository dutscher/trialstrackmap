angular.module("trialsTrackmap")
    .service("canvas", function ($document, $rootScope, debounce, $injector) {

        var canvas = $document[0].querySelector("canvas"),
            ctx = canvas ? canvas.getContext("2d") : null,
            srvc = {
                isDrawable: true,
                exists: function () {
                    return ctx !== null;
                },
                setDimensions: function (width, height) {
                    angular.element(canvas).attr({
                        width: width,
                        height: height
                    });

                    $rootScope.$emit("canvas:ready");
                },
                clear: function (whoIs) {
                    if (this.exists()) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                },
                drawCategoryTrack: function (_coords_, color) {
                    if (this.exists()) {
                        var coords = _coords_.split(","),
                            centerX = parseInt(coords[0]),
                            centerY = parseInt(coords[1]),
                            radius = parseInt(coords[2]);

                        ctx.beginPath();
                        // circle
                        ctx.arc(parseInt(centerX), parseInt(centerY), parseInt(radius), 0, 2 * Math.PI, true);
                        ctx.globalAlpha = 0.2;
                        ctx.fillStyle = "#" + color;
                        ctx.closePath();
                        ctx.fill();

                        // circle border
                        ctx.globalAlpha = 1;
                        ctx.lineWidth = 5;
                        ctx.strokeStyle = "#" + color;
                        ctx.stroke();
                    }
                },
                handleShowTrackOnMap: function (track, showForSearch) {
                    var isOnOtherWorld = $injector.get("trackData").getWorld() !== track.world;

                    if (!showForSearch || isOnOtherWorld) {
                        srvc.clear("handleShowTrackOnMap");
                    }

                    if (isOnOtherWorld) {
                        return;
                    }

                    var color =  true ? "ff0000" : "fce195", // showForSearch
                        coords = track.coords.split(","),
                        centerX = parseInt(coords[0]),
                        centerY = parseInt(coords[1]);

                    $rootScope.$emit("map.panTo", centerX, centerY);

                    srvc.drawTrack(track.coords, color);
                },
                drawTrack: function (_coords_, color) {
                    if (srvc.exists() && srvc.isDrawable) {
                        var coords = _coords_.split(","),
                            centerX = parseInt(coords[0]),
                            centerY = parseInt(coords[1]),
                            radius = parseInt(coords[2]);

                        ctx.beginPath();
                        // circle
                        ctx.arc(parseInt(centerX), parseInt(centerY), parseInt(radius), 0, 2 * Math.PI, true);

                        // circle border
                        ctx.globalAlpha = 0.9;
                        ctx.lineWidth = 10;
                        ctx.strokeStyle = "#" + color;
                        ctx.stroke();
                    }
                }
            };

        srvc.drawTrack = debounce(srvc.drawTrack, 500, false);

        return srvc;
    });