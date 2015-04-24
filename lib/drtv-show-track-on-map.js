angular.module('trialsTrackmap')
.directive('showTrackOnMap',function(){
    return {
        restrict: 'A',
        scope: {
            data: '=showTrackOnMap'
        },
        link: function(scope, element){
            var canvas = document.querySelector('canvas');
            var ctx = canvas.getContext('2d');

            function showTrackOnMap(){
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if(!scope.data.track.genCoords)
                    return false;

                var cat = scope.data.cats.filter(function(cat){return cat.class == scope.data.catClass});
                var color = '#'+(cat.length == 1 ? cat[0].color : 'fce195');
                var coords = scope.data.track.genCoords.split(',');
                var centerX = parseInt(coords[0]);
                var centerY = parseInt(coords[1]);
                var radius = parseInt(coords[2])+10;

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

            element.bind('mouseenter click', function(){
                showTrackOnMap();
            });
        }
    }
})