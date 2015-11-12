angular.module("trialsTrackmap")
    .directive("copyText", function ($rootScope, $document) {
        return {
            restrict: "A",
            link: function (scope, element) {

                $rootScope.$on("copyText", function (event, text) {
                    if(!event && !text) {
                        return false;
                    }

                    var textArea = angular.element(element);
                        textArea.text(text);
                        textArea[0].select();

                    try {
                        var successful = document.execCommand("copy");
                        var msg = successful ? "successful" : "unsuccessful";
                        console.log("Copying text command was " + msg + " / " + text);
                    } catch (err) {
                        console.log("Oops, unable to copy");
                    }
                });
            }
        }
    })