angular.module("trialsTrackmap")
    .directive("homeShackEditorPreview", function ($rootScope, $document) {
        return {
            restrict: "A",
            link: function (scope, element) {
                var parts = element[0].querySelectorAll(".costum__part"),
                    markupPreview = $document[0].querySelectorAll(".markupPreview");
                $rootScope.$on("editor:changed", function (event, data) {
                    // preview
                    angular.forEach(parts, function (part) {
                        var $part = angular.element(part);
                        if ($part.attr("type") === data.type) {
                            part.className = part.className.replace(/costum--\d{1,}/g, "");
                            $part.addClass("costum--" + data.costumId);
                        }
                    });
                    // markup changer
                    angular.forEach(markupPreview, function (preview) {
                      var string = preview.querySelectorAll(".hljs-string");
                      angular.forEach(string, function (string) {
                        var $string = angular.element(string);
                        if($string.text().indexOf("costum--" + data.type) !== -1
                        || $string.text().indexOf("--arm") !== -1 && data.type === "body") {
                          $string.html($string.text().replace(/costum--\d{1,}/g, "costum--" + data.costumId));
                        }
                      });
                    });
                });
            }
        }
    })