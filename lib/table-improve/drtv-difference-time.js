angular.module("trialsTrackmap")
    .directive("differenceTime", function ($parse) {
        return {
            restrict: "A",
            scope: {
                time: "=differenceTime"
            },
            template: '\
                 <span class="difference-time"\
                    ng-if="time"\
                    ng-class="{\'better-time\':time.prefix === \'-\'}">\
                    {%time.prefix%}{%time.time|convertTime:true%}\
                </span>\
            '
        }
    })