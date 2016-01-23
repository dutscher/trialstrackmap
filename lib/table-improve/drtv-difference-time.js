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
            ',
            link: function (scope, element) {
                scope.$watch("time", function (newTime) {
                    if (newTime) {
                        angular.element(element).css("display", null);
                    } else {
                        angular.element(element).css("display", "none");
                    }
                });
            }
        }
    })