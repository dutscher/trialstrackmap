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

                scope.$watch("[selectedWrOS,selectedWrBikeType,selectedWrSort]", function () {
                    if (scope.selectedWrOS + "|" + scope.selectedWrBikeType === type) {
                        sortDirection = scope.selectedWrSort;
                        handleIcon();
                    } else {
                        handleIcon(true);
                    }
                });
            }
        }
    })