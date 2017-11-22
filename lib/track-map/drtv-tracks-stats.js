angular.module("trialsTrackmap")
    .directive("trackStats", function(trackStats, $rootScope){
        return {
            restrict: "A",
            template: '\
                <span class="stats-headline"><strong>{%counts.onMap%}</strong> {%"page.rightSidebar.onMap"|translate%}</span>\
                <span class="stats-extra-tracks stats-mini-text">\
                    <strong>{%counts.worlds[1]%}</strong> {%"page.ferryTo.1"|translate%}<br />\
                    <strong>{%counts.worlds[2]%}</strong> {%"page.ferryTo.2"|translate%}\
                </span> \
                <span class="stats-headline"><strong>{%counts.withoutCoords%}</strong> {%"page.rightSidebar.withoutCoords"|translate%}</span>\
                <span class="stats-extra-tracks">\
                    <span ng-if="counts.notReleased.length > 0">\
                        <strong>{%counts.notReleased.length%}</strong> {%"page.rightSidebar.commingSoon"|translate%}\
                        <span class="stats-track-names">\
                            <span ng-repeat="track in counts.notReleased" track-in-sidebar="{track:track}"></span>\
                        </span>\
                        <span class="stats-track-names stats-track-names--warning" ng-if="counts.tierZeroTracks">\
                            <span ng-repeat="track in counts.tierZeroTracks" track-in-sidebar="{track:track}"></span>\
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
                        console.log(scope.counts)
                    }
                });
            }
        };
    })