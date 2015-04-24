angular.module('trialsTrackmap')
.directive('candyList', function(){
    return {
        restrict: 'A',
        scope: {
            track: '=candyList'
        },
        template: '<i ng-repeat="candy in track.candys" class="candy" show-track-in-modal="candy:{{$index}}"></i>'
    }
})