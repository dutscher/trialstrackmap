angular.module("trialsTrackmap")
    .directive("homeShackEditorPreview", function ($rootScope) {
        return {
            restrict: "A",
            link: function (scope, element) {
                var parts = element[0].querySelectorAll(".costum__part");
                $rootScope.$on("editor:changed", function (event, data) {
                    angular.forEach(parts, function (part) {
                        var $part = angular.element(part);
                        if ($part.attr("type") === data.type) {
                            part.className = part.className.replace(/costum--\d{1,}/g, "");
                            $part.addClass("costum--" + data.costumId);
                        }
                    });
                });
            }
        }
    })