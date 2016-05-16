angular.module("trialsTrackmap")
.directive("trackInSidebar", function(){
    return {
        restrict: "A",
        scope: {
            data: "=trackInSidebar"
        },
        template: '\
            <span show-track-in-modal="startline" class="track-available"> \
                <span class="map-pointer" show-track-on-map="data" title="{%\'page.rightSidebar.showTrackOnMap\'|translate%}"></span>\
                {%track.i18n%}\
                <span class="youtube-list" data-track="track" data-with-badge="true"></span>\
                <i class="data-cube" ng-if="data.track.datacube" show-track-in-modal="datacube"></i> \
                <span class="candy-list" data-track="data.track" data-with-badge="true"></span> \
            </span>\
        ',
        link: function(scope, element){
            // link to this one
            scope.track = scope.data.track;
        }
    };
})