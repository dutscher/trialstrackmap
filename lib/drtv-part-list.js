angular.module('trialsTrackmap')
.directive('partList', function(){
    return {
        restrict: 'A',
        scope: {
            track: '=partList',
            scale: '@partScale',
        },
        template: '<style>i.part{ width:{{::size}}px; height:{{::size}}px; display:inline-block; background-size:{{::bg.width}}px {{::bg.height}}px }</style>' +
                  '<span ng-repeat="(level, parts) in track.parts" class="part-level">' +
                    '<i ng-repeat="part in parts" class="part" style="background-position:-{{::(size * (level - 1))}}px -{{::(size * (part - 1))}}px" title="{{\'parts.\'+part|translate}} {{::level}}"></i>' +
                  '</span>',
        controller: function($scope){
            var size = 50,
                bgDim = '261x500'.split('x'),
                scale = 2;

            if(!$scope.scale)
                $scope.scale = scale;

            $scope.size = size / $scope.scale;
            $scope.bg = {
                width: bgDim[0] / $scope.scale,
                height: bgDim[1] / $scope.scale
            };
        }
    }
})