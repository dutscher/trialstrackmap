angular.module("trialsTrackmap")
    .directive("editImprove", function ($filter, improveTimes, $timeout) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var type = attrs.editImprove,
                    trackId = scope.track.id;

                function genPromptMessage(forceType){
                    return ""
                        + $filter("translate")("page.timesTable.improve.edit")
                        + " "
                        + $filter("translate")("page.timesTable.improve." + (forceType ? forceType : type))
                        + (type === "myTime" ? "\n" + $filter("translate")("page.timesTable.improve.editMyTime") : "")
                }

                function checkForNextUpdate(){
                    if(type === "myRank") {
                        $timeout(function() {
                            element
                                .next()
                                .triggerHandler("click");
                        }, 0);
                    }
                }

                element.on("click", function () {
                    var mode = improveTimes.getMode(),
                        bike = improveTimes.getBike(),
                        rawValue = scope.track.improve[mode][bike][type],
                        defaultValue = type !== "myRank" ? improveTimes.convertTime(rawValue) : rawValue,
                        value = prompt(genPromptMessage(), defaultValue);

                    if (value !== null
                        && value !== ""
                        && defaultValue !== value) {

                        improveTimes
                            .setScope(scope)
                            .update(type, trackId, value);

                        checkForNextUpdate();
                    }
                });
            }
        }
    })