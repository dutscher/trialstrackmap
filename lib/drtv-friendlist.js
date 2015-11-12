angular.module('trialsTrackmap')
.directive('friendlist', function() {
    return {
        restrict: 'A',
        scope: {
            friends: '=friendlist'
        },
        template:   '<div ng-repeat="char in chars">'+
                        '<h3>{%::char.letter|uppercase%}</h3>'+
                        '<div ng-repeat="friend in char.friends|orderBy"><span>{%::friend|split:\':\':0%}</span></div>'+
                    '</div>',
        controller: function ($scope) {
            $scope.$watch('friends', function(){
                if(!$scope.friends || $scope.friends.length == 0)
                    return false;

                var a = 97;
                $scope.chars = [];
                for (var i = 0; i<26; i++) {
                    var charLetter = String.fromCharCode(a + i),
                        foundedFriends = $scope.friends.filter(function(friend){
                            return friend.toLowerCase().indexOf(charLetter) === 0;
                        });

                    if(foundedFriends.length > 0) {
                        $scope.chars.push({
                            letter: charLetter,
                            friends: foundedFriends
                        });
                    }
                }
            });
        }
    }
})