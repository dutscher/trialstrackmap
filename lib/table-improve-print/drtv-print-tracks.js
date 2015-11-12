angular.module("trialsTrackmap")
    .directive("printTracks", function ($parse, improveTimes) {
        return {
            restrict: "A",
            replace: true,
            scope: true,
            template: '\
                <tr ng-repeat="track in data.tracks|printTracks:tier:cat:with:without">\
                    <td class="center">\
                    </td>\
                    <td cats-as-class="{track:track,onlyColor:true}">\
                        {%track.i18n|stripLevel%}\
                    </td>\
                    <td></td>\
                    <td></td>\
                </tr>\
            ',
            link: function (scope, element, attrs) {
                var params = $parse(attrs.printTracks)(scope);
                scope.tier = params.tier;
                scope.cat = params.cat;
                scope.with = params.with;
                scope.without = params.without;
            }
        }
    })