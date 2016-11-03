angular.module("trialsTrackmap")
    .directive("trackStats", function(trackStats, $rootScope){
        return {
            restrict: "A",
            template: '\
                {%counts.released%} {%"page.rightSidebar.released"|translate%} ({%counts.bunker.length%} {%"page.rightSidebar.onlyBunker"|translate%})<br /> \
                ------<br />\
                {%counts.all%} {%"page.rightSidebar.onMap"|translate%} ({%counts.worlds[1]%} | {%counts.worlds[2]%})<br />\
                {%counts.coords%} {%"page.rightSidebar.withoutCoords"|translate%}<br />\
                <span class="without-coords">\
                    <span ng-if="counts.not_released.length > 0">\
                        {%counts.not_released.length%} {%"page.rightSidebar.notReleased"|translate%}\
                        <span class="stats-track-names">\
                            <span ng-repeat="track in counts.not_released" track-in-sidebar="{track:track}"></span>\
                        </span>\
                    </span> \
                    {%counts.bunker.length%} {%"page.rightSidebar.onlyBunker"|translate%}<br />\
                    <span class="stats-track-names">\
                        <span ng-repeat="track in counts.bunker" track-in-sidebar="{track:track}"></span>\
                    </span>\
                    {%counts.event.length%} {%"page.rightSidebar.onlyEvent"|translate%}<br />\
                    <span class="stats-track-names">\
                        <span ng-repeat="track in counts.event" track-in-sidebar="{track:track}"></span>\
                    </span>\
                    {%counts.leaked.length%} {%"page.rightSidebar.leaked"|translate%}<br />\
                    <span class="stats-track-names">\
                        <span ng-repeat="track in counts.leaked" track-in-sidebar="{track:track}"></span>\
                    </span>\
                </span>\
                {%counts.youtube%} {%"page.rightSidebar.withVideo"|translate%}<br />',
            link: function(scope){
                $rootScope.$on("tracks:ready",function(){
                    if(scope.data.tracks) {
                        scope.counts = trackStats.get(scope.data.tracks);
                    }
                });
            }
        };
    })