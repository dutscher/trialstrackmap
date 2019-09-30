angular.module("trialsTrackmap")
    .controller("wrTemple", function ($scope, urlHandler, WRTimes, localStorageService) {
        var lsKey = "templeRider";

        $scope.search = urlHandler.get("search");
        $scope.saveSearch = function () {
            urlHandler.set({search: $scope.search});
        };
        $scope.clearSearch = function () {
            $scope.search = "";
            $scope.saveSearch();
        };

        urlHandler.setParams(["androidBikeType", "androidSort", "iosBikeType", "iosSort"]);
        $scope.selectedAndroidBikeType = urlHandler.get("androidBikeType") || urlHandler.read("androidBikeType");
        $scope.selectedAndroidSort = urlHandler.get("androidSort") || urlHandler.read("androidSort");
        $scope.selectedIosBikeType = urlHandler.get("iosBikeType") || urlHandler.read("iosBikeType");
        $scope.selectedIosSort = urlHandler.get("iosSort") || urlHandler.read("iosSort");

        $scope.sort = function (type) {
            // <th table-sorter="android|normal">
            var raw = type.split("|"),
                os, bikeType, sort, isNew;

            os = raw[0];
            bikeType = raw[1];

            if(os === "android") {
                isNew = bikeType !== $scope.selectedAndroidBikeType;

                if (isNew || $scope.selectedAndroidSort === "desc") {
                    sort = "asc";
                } else {
                    sort = "desc";
                }

                $scope.selectedAndroidBikeType = bikeType;
                $scope.selectedAndroidSort = sort;
            } else {
                isNew = bikeType !== $scope.selectedIosBikeType;

                if (isNew || $scope.selectedIosSort === "desc") {
                    sort = "asc";
                } else {
                    sort = "desc";
                }

                $scope.selectedIosBikeType = bikeType;
                $scope.selectedIosSort = sort;
            }

            urlHandler.set({
                androidBikeType: $scope.selectedAndroidBikeType,
                androidSort: $scope.selectedAndroidSort,
                iosBikeType: $scope.selectedIosBikeType,
                iosSort: $scope.selectedIosSort
            });
            urlHandler.save("selectedAndroidBikeType", $scope.selectedAndroidBikeType);
            urlHandler.save("selectedAndroidSort", $scope.selectedAndroidSort);
            urlHandler.save("selectedIosBikeType", $scope.selectedIosBikeType);
            urlHandler.save("selectedIosSort", $scope.selectedIosSort);

            $scope.getRider();
        };

        $scope.allRider = 0;
        $scope.sortedRider = {
            android: [],
            ios: []
        };
        $scope.tailRider = [];
        $scope.getRider = function () {
            var sortedRider = WRTimes.getRiderSortedByOS(
                $scope.data.rider,
                $scope.selectedAndroidBikeType, $scope.selectedAndroidSort,
                $scope.selectedIosBikeType, $scope.selectedIosSort);
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