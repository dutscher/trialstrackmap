angular.module("trialsTrackmap")
    .directive("printTracks", function ($parse) {
        return {
            restrict: "A",
            replace: true,
            scope: true,
            template: '\
                <tr ng-repeat="track in data.tracks|printTracks:tier:cat:with:without">\
                    <td class="center">\
                        <span ng-hide="isEmpty">\
                            {%track.improve[selectedMode][selectedBike].myRank%}\
                        </span>\
                    </td>\
                    <td cats-as-class="{track:track,onlyColor:true}">\
                        {%track.i18n|stripLevel%}\
                    </td>\
                    <td>\
                        <span ng-hide="isEmpty">\
                            {%track.improve[selectedMode][selectedBike].myTime|convertTime%}\
                            <span difference-time="track.improve[selectedMode][selectedBike].differenceTime"></span>\
                        </span>\
                    </td>\
                    <td>\
                        <span ng-hide="isEmpty">\
                            {%track.times.worldRecord[selectedMode][selectedBike].time|convertTime%}\
                        </span>\
                    </td>\
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