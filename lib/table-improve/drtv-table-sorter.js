angular.module("trialsTrackmap")
    .directive("tableSorter", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var type = attrs.tableSorter,
                    icon,
                    sortDirection;

                // clear copy or what ever
                if (element[0].querySelector("i.arrow") !== null) {
                    icon = element[0].querySelector("i.arrow");
                }

                function handleIcon(remove) {
                    if (icon) {
                        icon.remove();
                    }

                    if (!remove) {
                        icon = angular.element('<i class="arrow ' + sortDirection + '"></i>');
                        element.append(icon);
                    }
                }

                element.on("click", function () {
                    scope.sort(type);
                    scope.$apply();
                });

                scope.$watch("[selectedSort,selectedSortType]", function () {
                    if (scope.selectedSortType === type) {
                        sortDirection = scope.selectedSort;
                        handleIcon();
                    } else {
                        handleIcon(true);
                    }
                });

                scope.$watch("[selectedAndroidBikeType,selectedAndroidSort,selectedIosBikeType,selectedIosSort]", function () {
                    if ("android|" + scope.selectedAndroidBikeType === type) {
                        sortDirection = scope.selectedAndroidSort;
                        handleIcon();
                    } else if ("ios|" + scope.selectedIosBikeType === type) {
                        sortDirection = scope.selectedIosSort;
                        handleIcon();
                    } else {
                        handleIcon(true);
                    }
                });
            }
        }
    })