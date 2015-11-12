angular.module("trialsTrackmap")
    .directive("isLoading", function ($rootScope, $timeout) {
        return {
            restrict: "C",
            link: function (scope, element, attributes) {
                $rootScope.$on("$translateChangeSuccess", function (event) {
                    if(!event) {
                        return false;
                    }

                    $timeout(function(){
                        angular.element(element).addClass("is-ready");
                        scope[attributes.finished] = true;
                    },1000);
                });
            }
        }
    })