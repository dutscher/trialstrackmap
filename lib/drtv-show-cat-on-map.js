angular.module("trialsTrackmap")
.directive("showCatOnMap",function($rootScope){
    return {
        restrict: "A",
        scope: {
            data: "=showCatOnMap"
        },
        link: function(scope, element){
            var canvas = document.querySelector("canvas"),
                ctx = canvas ? canvas.getContext("2d") : null;

            if (ctx === null) {
                return;
            }

            function showCatOnMap(){
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                scope.data.tracks.forEach(function(track){
                    var catIds = track.cats.split(",");

                    if(!track.coords || catIds.indexOf(""+scope.data.catIndex) == -1)
                        return false;

                    var coords = track.coords.split(","),
                        centerX = parseInt(coords[0]),
                        centerY = parseInt(coords[1]),
                        radius = parseInt(coords[2]);

                    $rootScope.$emit("map.panToCenter");

                    ctx.beginPath();
                    // circle
                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
                    ctx.globalAlpha = 0.2;
                    ctx.fillStyle = "#"+scope.data.cat.color;
                    ctx.closePath();
                    ctx.fill();

                    // circle border
                    ctx.globalAlpha = 1;
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = "#"+scope.data.cat.color;
                    ctx.stroke();
                })
            }

            element.bind("mouseenter", function(){
                showCatOnMap();
            });

            element.bind("click", function(event){
                showCatOnMap();
                $rootScope.$broadcast("handleSidebars",event,"right","close",true);
            });
        }
    }
})