angular.module("trialsTrackmap")
    .service("canvas", function ($document) {

        var canvas = $document[0].querySelector("canvas"),
            ctx = canvas ? canvas.getContext("2d") : null;

        return {
            exists: function () {
                return ctx !== null;
            },
            clear: function () {
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
            drawTrack: function (_coords_, color) {
                if (this.exists()) {
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
        }
    })