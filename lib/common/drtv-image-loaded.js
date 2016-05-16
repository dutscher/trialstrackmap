angular.module("trialsTrackmap")
    .directive("imageLoaded", function ($parse, $rootScope, $timeout) {
        return {
            restrict: "A",
            priority: 2,
            link: function(scope, element, attr){
                var fn = $parse(attr["imageLoaded"]);

                function loaded() {
                    element.addClass("loaded");
                    $timeout(function(){
                        $rootScope.$emit("image:loaded", element);
                        fn(scope);
                    });
                }

                if (element[0].hasOwnProperty("isLoaded") && element[0].isLoaded) {
                    loaded();
                } else {
                    element.on("load", function (event) {
                        loaded(event);
                    });
                }
            }
        }
    })