angular.module("trialsTrackmap")
.directive("candyList", function(){
    return {
        restrict: "C",
        scope: {
            track: "=track"
        },
        template: function(tElement, tAttr){
            if(tAttr.withBadge) {
                return '\
                    <span ng-if="track.candies" ng-class="{\'with-badge\':track.candies.length > 1}">\
                        <i class="candy" show-track-in-modal="candy:0"></i> \
                        <i ng-if="track.candies.length > 1" class="badge">{%::track.candies.length%}</i> \
                    </span>\
                ';
            } else {
                return '<i ng-if="track.candies" ng-repeat="candy in track.candies" class="candy" show-track-in-modal="candy:{%::$index%}"></i>';
            }
        }
    }
})