angular.module('trialsTrackmap')
    .directive('partList', function () {
        return {
            restrict: 'A',
            scope: {
                track: '=partList',
                scale: '@partScale',
                index: '@index',
                printName: "@printName"
            },
            template: '\
                <style ng-if="index == 0">\
                    i.part{ \
                        width:{%::size%}px; \
                        height:{%::size%}px; \
                        display:inline-block; \
                        background-repeat:no-repeat;\
                        background-size:{%::bg.width%}px {%::bg.height%}px \
                    }\
                </style>\
                <span ng-repeat="part in newParts" class="part-level" ng-if="newParts.length > 0">\
                    <span ng-if="printName">{% part.id %}.</span>\
                    <i \
                        class="part" \
                        style="background-position: {%genBgPos(part.level, part.id)%}"\
                        title="{%\'parts.\' + part.id|translate%} {%::part.level%}"></i>\
                    <span ng-if="printName">{%\'parts.\' + part.id|translate%}</span><br ng-if="printName" />\
                </span>',
            controller: function ($scope) {
                var size = 105,
                    bgDim = '525x1050'.split('x'),
                    scale = 1;
                
                if (!$scope.scale || $scope.scale === 0) {
                    $scope.scale = scale;
                }
                
                $scope.breakDownToOneLevel = function (array) {
                    if(!array) {
                        return array;
                    }
    
                    var newArray = [],
                        keys = Object.keys(array);
                    keys.forEach(function(partLevel){
                        array[partLevel].forEach(function(partId){
                            newArray.push({
                                level: partLevel,
                                id: partId
                            })
                        })
                    });
                    
                    return newArray;
                };
                
                $scope.genBgPos = function (level, part) {
                    var x = ($scope.size * (level - 1)),
                        y = ($scope.size * (part - 1));
                    
                    return (x !== 0 ? -(x) + "px" : 0) + " " + (y !== 0 ? -(y) + "px" : 0);
                };
                
                $scope.size = size / parseInt($scope.scale);
                $scope.bg = {
                    width: bgDim[0] / parseInt($scope.scale),
                    height: bgDim[1] / parseInt($scope.scale)
                };
                
                $scope.$watch("track.parts", function(){
                    $scope.newParts = $scope.breakDownToOneLevel($scope.track.parts);
                })
            }
        }
    })