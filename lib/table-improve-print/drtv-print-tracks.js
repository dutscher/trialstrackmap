angular.module("trialsTrackmap")
    .directive("printTracks", function ($parse) {
        return {
            restrict: "A",
            replace: true,
            scope: true,
            template: '\
                <tr ng-repeat="track in data.tracks|printTracks:tier:cat:with:without">\
                    <td class="center">\
                        \
                    </td>\
                    <td cats-as-class="{track:track,onlyColor:true}">\
                        {%track.i18n|stripLevel%}\
                    </td>\
                    <td class="center" check-min="{isEmpty:isEmpty,typeValue:minRank,value:track.improve[selectedOS][selectedBike].myRank}">\
                        <span ng-hide="isEmpty || track.improve[selectedOS][selectedBike].myRank == \'?!?\'">\
                            {%track.improve[selectedOS][selectedBike].myRank%}\
                        </span>\
                    </td>\
                    <td class="center" check-min="{typeValue:minDiff,value:track.improve[selectedOS][selectedBike].differenceTime.time}">\
                        <span ng-hide="isEmpty">\
                            <span difference-time="track.improve[selectedOS][selectedBike].differenceTime"></span>\
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