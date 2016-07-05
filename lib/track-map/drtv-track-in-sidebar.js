angular.module("trialsTrackmap")
    .directive("trackInSidebar", function (items) {
        return {
            restrict: "A",
            scope: {
                data: "=trackInSidebar"
            },
            template: '\
                <span show-track-in-modal="startline" class="track-available">\
                    <span class="map-pointer" show-track-on-map="data" title="{%\'page.rightSidebar.showTrackOnMap\'|translate%}"></span>\
                    {%track.i18n%}\
                    ' + items.getSidebarItemsList() + '\
                </span>\
            ',
            link: function (scope, element) {
                // link to this one
                scope.track = scope.data.track;
            }
        };
    })