angular.module("trialsTrackmap")
    .directive("mapColors", function ($rootScope) {
        return {
            restrict: "A",
            scope: true,
            link: function (scope, element) {
                var css = "";

                function drawColors() {
                    scope.cats.forEach(function (cat) {
                        css += "." + cat.class + "{color:#" + cat.color + "}";
                        css += "." + cat.class + "-bg{background-color:#" + cat.color + "}";
                    });

                    scope.tiers.forEach(function (tier) {
                        css += "." + tier.class + "{color:#" + tier.color + "}";
                        css += "." + tier.class + "-bg{background-color:#" + tier.color + "}";
                    });

                    element.html(css);
                }

                $rootScope.$on("data:loaded", function (event, data) {
                    scope.cats = data.map.cats;
                    scope.tiers = data.map.tiers;

                    drawColors();
                });
            }
        }
    })