angular.module("trialsTrackmap")
    .directive("stopScroll", function(){
        return {
            restrict: "A",
            link: function(scope, element){
                angular.element(element).on("mousewheel", function(event){
                    event.stopPropagation();
                })
            }
        }
    })