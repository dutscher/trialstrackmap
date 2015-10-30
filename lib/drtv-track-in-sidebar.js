angular.module("trialsTrackmap")
.directive("trackInSidebar", function(){
    return {
        restrict: "A",
        scope: {
            data: "=trackInSidebar"
        },
        template: '<span show-track-on-map="data" show-track-in-modal="startline" class="track-available"> \
                        {{track.i18n}} \
                        <i class="youtube" ng-if="data.track.youtube" show-track-in-modal="youtube"></i> \
                        <i class="data-cube" ng-if="data.track.datacube" show-track-in-modal="datacube"></i> \
                        <span candy-list="data.track" ng-if="data.track.candys"></span> \
                   </span>',
        link: function(scope, element){
            // link to this one
            scope.track = scope.data.track;
        }
    };
})