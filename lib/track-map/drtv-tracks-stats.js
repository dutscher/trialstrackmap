angular.module("trialsTrackmap")
    .directive("trackStats", function(trackStats, $rootScope){
        return {
            restrict: "A",
            template: '\
                <strong>{%counts.released%}</strong> {%"page.rightSidebar.released"|translate%} (<strong>{%counts.bunker.length%}</strong> {%"page.rightSidebar.onlyBunker"|translate%})<br /> \
                <strong>{%counts.coords%}</strong> {%"page.rightSidebar.withoutCoords"|translate%}<br />\
                <span class="without-coords">\
                    <span ng-if="counts.not_released.length > 0">\
                        <strong>{%counts.not_released.length%}</strong> {%"page.rightSidebar.notReleased"|translate%}\
                        <span class="stats-track-names">\
                            <span ng-repeat="track in counts.not_released" track-in-sidebar="{track:track}"></span>\
                        </span>\
                    </span> \
                    <strong>{%counts.bunker.length%}</strong> {%"page.rightSidebar.onlyBunker"|translate%}<br />\
                    <span class="stats-track-names">\
                        <span ng-repeat="track in counts.bunker" track-in-sidebar="{track:track}"></span>\
                    </span>\
                    <strong>{%counts.event.length%}</strong> {%"page.rightSidebar.onlyEvent"|translate%}<br />\
                    <span class="stats-track-names">\
                        <span ng-repeat="track in counts.event" track-in-sidebar="{track:track}"></span>\
                    </span>\
                </span>\
            ',
            link: function(scope){
                $rootScope.$on("tracks:ready",function(){
                    if(scope.data.tracks) {
                        scope.counts = trackStats.get(scope.data.tracks);
                    }
                });
            }
        };
    })