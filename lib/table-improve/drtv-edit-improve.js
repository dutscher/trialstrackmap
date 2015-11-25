angular.module("trialsTrackmap")
    .directive("editImprove", function (improveTimes, dialogEditMyRank, dialogEditMyValue, $filter, $timeout) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var type = attrs.editImprove;

                element.on("click", function () {
                    switch(true){
                        case (type === "myRank"):
                            dialogEditMyRank.open(scope.track, scope).then(function(){
                                $timeout(function() {
                                    element
                                        .next()
                                        .triggerHandler("click");
                                }, 0);
                            });
                            break;
                        case (type === "myTime"):
                            dialogEditMyValue.open(scope.track, type, scope);
                            break;
                        case (type === "myGoal"):
                            dialogEditMyValue.open(scope.track, type, scope);
                            break;
                    }
                });
            }
        }
    })