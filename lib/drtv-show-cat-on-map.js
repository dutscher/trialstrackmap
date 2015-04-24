angular.module('trialsTrackmap')
.directive('showCatOnMap',function($rootScope){
    return {
        restrict: 'A',
        scope: {
            data: '=showCatOnMap'
        },
        link: function(scope, element){
            var canvas = document.querySelector('canvas');
            var ctx = canvas.getContext('2d');

            function showCatOnMap(){
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                scope.data.tracks.forEach(function(track){

                    var catIds = track.cats.split(',');

                    if(!track.genCoords || catIds.indexOf(''+scope.data.catIndex) == -1)
                        return false;

                    var coords = track.genCoords.split(',');
                    var centerX = parseInt(coords[0]);
                    var centerY = parseInt(coords[1]);
                    var radius = parseInt(coords[2])+10;

                    ctx.beginPath();
                    // circle
                    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
                    ctx.globalAlpha = 0.2;
                    ctx.fillStyle = '#'+scope.data.cat.color;
                    ctx.closePath();
                    ctx.fill();

                    // circle border
                    ctx.globalAlpha = 1;
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = '#'+scope.data.cat.color;
                    ctx.stroke();
                })
            }

            element.bind('mouseenter', function(){
                showCatOnMap();
            });

            element.bind('click', function(event){
                showCatOnMap();
                $rootScope.$broadcast('handleSidebars',event,'right','close',true);
            });
        }
    }
})