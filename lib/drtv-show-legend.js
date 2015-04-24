angular.module('trialsTrackmap')
.directive('showLegend', function(){
        var allLegendsCheckboxes = [];

        return {
            restrict: 'A',
            scope: {
                data: '=showLegend'
            },
            link: function (scope, element) {
                var checkbox = element.find('input');
                var canvas = document.querySelector('canvas');
                var ctx = canvas.getContext('2d');

                function showLegend(){
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    scope.data.tracks.forEach(function(track){
                        if(!track.genCoords
                            || 'tier' in scope.data && track.tier != scope.data.tier
                            || 'cat' in scope.data && track.cats.indexOf(scope.data.cat) == -1)
                            return false;

                        var trackCats = track.cats.split(',');
                        var color = '#'+scope.data.cats[('cat' in scope.data ? scope.data.cat : trackCats[0]-1)].color;
                        var coords = track.genCoords.split(',');
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
                    })
                }

                element.bind('change', function(){
                    if(checkbox.prop('checked')){
                        // uncheck all other
                        allLegendsCheckboxes.forEach(function(_checkbox_){
                            if(_checkbox_ != checkbox)
                                _checkbox_.attr('checked', false);
                        });
                        showLegend();
                    } else {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                });
                allLegendsCheckboxes.push(checkbox);
            }
        }
})