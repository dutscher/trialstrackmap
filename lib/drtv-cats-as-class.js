angular.module("trialsTrackmap")
    .directive("catsAsClass", function ($rootScope, $parse, $filter, categories) {
        return {
            restrict: "A",
            scope: true,
            link: function (scope, element, attrs) {
                var params = $parse(attrs.catsAsClass)(scope),
                    cats = params.track.cats.split(",").map(Number);

                function update(onlyI18n) {
                    cats.forEach(function (catId) {
                        var cat = categories.findById(catId);
                        if (cat && cat.index == catId && !("notInTimes" in cat)) {
                            if (!onlyI18n) {
                                if(!("onlyColor" in params) || "winter" !== cat.class && ("onlyColor" in params)) {
                                    element.addClass(cat.class + (!("onlyColor" in params) ? "-bg" : ""));
                                }
                            }
                            element.attr("title", $filter("translate")("cats." + cat.index));
                            params.track.catIndex = cat.index;
                        }
                    });
                }

                update();

                $rootScope.$on("tracks:ready", function () {
                    update();
                });

                $rootScope.$on("$translateChangeSuccess", function () {
                    update(true);
                });
            }
        }
    })