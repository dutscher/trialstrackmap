angular.module("trialsTrackmap")
    .directive("homeShackEditor", function ($rootScope) {
        return {
            restrict: "A",
            link: function (scope, element) {
                var selects = angular.element(element).find("select");

                angular.forEach(selects, function (select) {
                    var $select = angular.element(select);
                    $select.on("change", function () {
                        $rootScope.$emit("editor:changed", {
                            type: $select.attr("type"),
                            costumId: select.options[select.selectedIndex].value
                        });
                    });
                });
            }
        }
    })