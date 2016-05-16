angular.module("trialsTrackmap")
    .controller("wrTemple", function ($scope, urlHandler, WRTimes) {

        $scope.search = urlHandler.get("search");
        $scope.saveSearch = function () {
            urlHandler.set({search: $scope.search});
        };
        $scope.clearSearch = function () {
            $scope.search = "";
            $scope.saveSearch();
        };

        urlHandler.setParams(["wrOS", "wrBikeType", "wrSort"]);
        $scope.selectedWrOS = urlHandler.get("wrOS") || urlHandler.read("selectedWrOS");
        $scope.selectedWrBikeType = urlHandler.get("wrBikeType") || urlHandler.read("selectedWrBikeType");
        $scope.selectedWrSort = urlHandler.get("wrSort") || urlHandler.read("selectedWrSort");

        $scope.sort = function (type) {
            var raw = type.split("|"),
                os, bikeType, sort, isNew;

            os = raw[0];
            bikeType = raw[1];
            isNew = os !== $scope.selectedWrOS || bike !== $scope.selectedWrBikeType;

            if (isNew || $scope.selectedWrSort === "desc") {
                sort = "asc";
            } else {
                sort = "desc";
            }

            $scope.selectedWrOS = os;
            $scope.selectedWrBikeType = bikeType;
            $scope.selectedWrSort = sort;

            urlHandler.set({
                wrOS: $scope.selectedWrOS,
                wrBikeType: $scope.selectedWrBikeType,
                wrSort: $scope.selectedWrSort
            });
            urlHandler.save("selectedWrOS", $scope.selectedWrOS);
            urlHandler.save("selectedWrBikeType", $scope.selectedWrBikeType);
            urlHandler.save("selectedWrSort", $scope.selectedWrSort);

            $scope.getRider();
        };

        $scope.allRider = 0;
        $scope.sortedRider = [];
        $scope.tailRider = [];
        $scope.getRider = function () {
            var sortedRider = WRTimes.getRiderSortedByOS($scope.data.rider, $scope.selectedWrOS, $scope.selectedWrBike, $scope.selectedWrSort);
            $scope.allRider = sortedRider.allRiderCount;
            $scope.sortedRider = sortedRider.allRider;
            $scope.tailRider = sortedRider.tailRider;
        };

        // watch on rider loader
        var $watcher = $scope.$watch("data.rider", function (rider) {
            if (rider && Object.keys(rider).length > 0) {
                $scope.getRider();
                $watcher();
            }
        });
    })