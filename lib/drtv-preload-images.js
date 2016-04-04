angular.module("trialsTrackmap")
    .directive("preloadImages", function ($rootScope, $filter, $useLocalFiles, $document) {
        return {
            restrict: "A",
            scope: true,
            link: function (scope, element, attr) {
                var css = "",
                    html = "",
                    event = attr.event || "tracks:ready";

                function preloadImages() {
                    var preloadWrap = document.querySelector(".preload");
                    Object.keys(scope.images).forEach(function (imageKey) {
                        if (imageKey === "trackmaps")
                            return;
                        var image = scope.images[imageKey],
                            url = image[$useLocalFiles ? "lSrc" : "src"];

                        // preload
                        css += '.preload .' + imageKey + '{background: url(\"' + $filter("hoster")(url, scope.hoster) + '\") no-repeat -9999px -9999px;}\n';
                        html += '<div class="' + imageKey + '"></div>\n';
                        // regular selector
                        css += image.selector + "{background" + (image.sprite ? "-image" : "") + ':url(\"' + $filter("hoster")(image[$useLocalFiles ? "lSrc" : "src"], scope.hoster) + '\") ' + (image.bgPos || "") + ';}\n';
                    });

                    preloadWrap.innerHTML = html;
                    element.html(css);
                }

                angular.element($document.find("body")).append('<div class="preload"></div>');

                $rootScope.$on(event, function (event, data) {
                    scope.images = data.images;
                    scope.hoster = data.hoster;

                    preloadImages();
                });
            }
        }
    })