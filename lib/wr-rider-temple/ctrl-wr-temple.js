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

        urlHandler.setParams(["wrOS", "wrBike", "wrSort"]);
        $scope.selectedWrOS = urlHandler.get("wrOS") || urlHandler.read("selectedWrOS");
        $scope.selectedWrBike = urlHandler.get("wrBike") || urlHandler.read("selectedWrBike");
        $scope.selectedWrSort = urlHandler.get("wrSort") || urlHandler.read("selectedWrSort");

        $scope.sort = function (type) {
            var raw = type.split("|"),
                os, bike, sort, isNew;

            os = raw[0];
            bike = raw[1];
            isNew = os !== $scope.selectedWrOS || bike !== $scope.selectedWrBike;

            if (isNew || $scope.selectedWrSort === "desc") {
                sort = "asc";
            } else {
                sort = "desc";
            }

            $scope.selectedWrOS = os;
            $scope.selectedWrBike = bike;
            $scope.selectedWrSort = sort;

            urlHandler.set({
                wrOS: $scope.selectedWrOS,
                wrBike: $scope.selectedWrBike,
                wrSort: $scope.selectedWrSort
            });
            urlHandler.save("selectedWrOS", $scope.selectedWrOS);
            urlHandler.save("selectedWrBike", $scope.selectedWrBike);
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