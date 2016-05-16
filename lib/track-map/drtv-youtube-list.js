angular.module("trialsTrackmap")
.directive("youtubeList", function(){
    return {
        restrict: "C",
        scope: {
            track: "=track"
        },
        template: function(tElement, tAttr){
            if(tAttr.withBadge) {
                return '\
                    <span ng-if="track.youtube" class="youtube-badge" ng-class="{\'with-badge\':track.youtube.length > 1}"> \
                        <i class="youtube" show-track-in-modal="youtube:0"></i> \
                        <i ng-if="track.youtube.length > 1" class="badge">{%::track.youtube.length%}</i> \
                    </span> \
                ';
            } else {
                return '<i ng-if="track.youtube" ng-repeat="video in track.youtube" class="youtube{%::video.type%}" show-track-in-modal="youtube:{%::$index%}"></i>';
            }
        }
    }
})