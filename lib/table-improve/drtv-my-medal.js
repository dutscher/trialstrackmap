angular.module("trialsTrackmap")
    .directive("myMedal", function (improveTimes, $rootScope) {
        return {
            restrict: "A",
            template: '\
                <i ng-if="medal" class="medal-{%medal%}"></i>\
            ',
            scope: {
                time: "=myTime",
                faults: "=myFaults"
            },
            link: function (scope, element, attrs) {
                var type = attrs.myMedal;


                scope.medal = "";

                function checkMedal() {
                    var trackData = scope.$parent.track,
                        times = trackData.times, // platinum | gold | silver -> faults | time
                        improve = trackData.improve, // ios | android -> normal | donkey | crazy -> myTime | maFaults
                        os = improveTimes.getOS(),
                        bikeType = improveTimes.getBikeType(),
                        myTime,
                        myFaults;

                    if (!improve
                        || !improve.hasOwnProperty(os)
                        || !improve[os].hasOwnProperty(bikeType)
                        || !improve[os][bikeType].hasOwnProperty(type)
                        || scope.time === ""
                        || isNaN(parseInt(scope.time))) {
                        return;
                    }

                    myTime = parseInt(scope.time); // myTime | myGoal
                    myFaults = !isNaN(parseInt(scope.faults)) ? parseInt(scope.faults) : 0;

                    if (myTime <= parseInt(times.platinum.time) && myFaults <= parseInt(times.platinum.faults)) {
                        scope.medal = "";
                    } else if (myTime <= parseInt(times.gold.time) && myFaults <= parseInt(times.gold.faults)) {
                        scope.medal = "gold"
                    } else if (myTime <= parseInt(times.silver.time) && myFaults <= parseInt(times.silver.faults)) {
                        scope.medal = "silver"
                    } else {
                        scope.medal = "bronze"
                    }
                }

                scope.$watch("[time,faults]", function () {
                    checkMedal();
                });
            }
        }
    })