angular.module("trialsTrackmap")
    .directive("itemList", function () {
        return {
            restrict: "C",
            scope: {
                track: "=track",
                type: "@type"
            },
            template: function (tElement, tAttr) {
                if (tAttr.withBadge) {
                    return '\
                    <span ng-if="isExists" ng-class="{\'with-badge\':items.length > 1}">\
                        <i class="{%::type%}" show-track-in-modal="{%::type%}:0"></i> \
                        <i ng-if="items.length > 1" class="badge">{%::items.length%}</i> \
                    </span>\
                ';
                } else {
                    return '<i ng-if="isExists" ng-repeat="item in items" class="{%::type%}" show-track-in-modal="{%::type%}:{%::$index%}"></i>';
                }
            },
            link: function (scope) {
                scope.$watch("track", function(){
                    scope.isExists = scope.track.hasOwnProperty(scope.type);
                    scope.items = scope.track[scope.type];
                });
            }
        }
    })