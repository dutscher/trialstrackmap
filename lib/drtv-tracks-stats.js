angular.module('trialsTrackmap')
    .directive('trackStats', function(trackStats){
        return {
            restrict: 'A',
            scope: {
                data: '=trackStats'
            },
            template: '{{counts.all}} {{"page.rightSidebar.on_map"|translate}}<br /> \
                        {{counts.coords}} {{"page.rightSidebar.without_coords"|translate}}<br />\
                        <span class="without-coords">\
                            <span ng-if="counts.not_released > 0">{{counts.not_released}} {{"page.rightSidebar.not_released"|translate}}</span> \
                            {{counts.bunker.length}} {{"page.rightSidebar.only_bunker"|translate}}<br />\
                            <span class="stats-track-names">\
                                <span ng-repeat="track in counts.bunker" track-in-sidebar="{track:track}"></span>\
                            </span>\
                            {{counts.event.length}} {{"page.rightSidebar.only_event"|translate}}<br />\
                            <span class="stats-track-names">\
                                <span ng-repeat="track in counts.event" track-in-sidebar="{track:track}"></span>\
                            </span>\
                            {{counts.leaked.length}} {{"page.rightSidebar.leaked"|translate}}<br />\
                            <span class="stats-track-names">\
                                <span ng-repeat="track in counts.leaked" track-in-sidebar="{track:track}"></span>\
                            </span>\
                        </span>\
                        {{counts.youtube}} {{"page.rightSidebar.with_video"|translate}}<br />',
            link: function(scope){
                scope.$watch('data',function(){
                    if(scope.data.tracks) {
                        scope.counts = trackStats.get(scope.data.tracks);
                    }
                });
            }
        };
    })