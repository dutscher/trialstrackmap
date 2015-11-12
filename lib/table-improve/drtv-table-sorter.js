angular.module("trialsTrackmap")
    .directive("tableSorter", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var type = attrs.tableSorter,
                    icon;

                // clear copy or what ever
                if(element[0].querySelector("i.arrow") !== null) {
                    icon = element[0].querySelector("i.arrow");
                }

                function handleIcon(remove) {
                    if(icon) {
                        icon.remove();
                    }

                    if(!remove) {
                        icon = angular.element('<i class="arrow ' + scope.selectedSort + '"></i>');
                        element.append(icon);
                    }
                }

                element.on("click", function () {
                    scope.sort(type);
                    scope.$apply();
                });

                scope.$watch("selectedSortType", function(selectedSortType){
                    if(selectedSortType === type) {
                        handleIcon();
                    } else {
                        handleIcon(true);
                    }
                });

                scope.$watch("selectedSort", function(){
                    if(scope.selectedSortType === type) {
                        handleIcon();
                    } else {
                        handleIcon(true);
                    }
                });
            }
        }
    })