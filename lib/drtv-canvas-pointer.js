angular.module('trialsTrackmap')
.directive('canvasPointer', function($rootScope, $filter){
    return {
        restrict: 'A',
        scope: true,
        link: function(scope, _canvas_){

            var canvas = _canvas_[0];
            var ctx = canvas.getContext('2d');

            _canvas_.bind('mousedown',function(e) {
                var coordX = parseInt(e.offsetX);
                var coordY = parseInt(e.offsetY);
                console.log('coords: "'+coordX+','+coordY+',60"');
            });

            scope.tracks = [];

            function drawTracks(){
                canvas.setAttribute('width', scope.dim[0] + 'px');
                canvas.setAttribute('height', scope.dim[1] + 'px');

                scope.tracks.forEach(function(track){
                    if(track.coords == '')
                        return;

                    var coords = track.coords.split(',');

                    var centerX = parseInt(coords[0]);
                    var centerY = parseInt(coords[1]);
                    var radius = parseInt(coords[2]);

                    ctx.beginPath();
                    // circle
                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
                    ctx.globalAlpha = 0;
                    ctx.closePath();
                    ctx.fill();

                    // circle border
                    ctx.globalAlpha = 1;
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = '#000';
                    ctx.stroke();

                    // coords rect
                    ctx.fillStyle = 'white';
                    ctx.fillRect(centerX, centerY, 100, 25);
                    ctx.fillStyle = 'black';
                    ctx.font = "12px sans-serif";

                    ctx.fillText(track.id+'. '+$filter('translate')('tracks.'+track.id), centerX+5, centerY+20);
                });
            }

            $rootScope.$on('data:loaded',function(event, data){
                scope.tracks = data.tracks;
                scope.dim = data.images.trackmap.dim.split('x');
                drawTracks();
            });
		}
    }
})