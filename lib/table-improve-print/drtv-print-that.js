angular.module("trialsTrackmap")
    .directive("printThat", function ($rootScope, $timeout, $window) {
        return {
            restrict: "A",
            link: function(scope, element, attrs){
                scope.$watch(attrs.printThat, function(isReady){
                    if(isReady){
                        $timeout(function(){
                            $window.print();
                        }, 0);
                    }
                });
            }
        }
    })