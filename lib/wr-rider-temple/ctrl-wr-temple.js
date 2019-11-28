angular.module("trialsTrackmap")
    .controller("wrTemple", function (
        $rootScope, $scope, urlHandler, bonxyApi,
        WRTimes, localStorageService) {
        var lsKey = "templeRider";

        $scope.search = urlHandler.get("search");
        $scope.saveSearch = function () {
            urlHandler.set({search: $scope.search});
        };
        $scope.clearSearch = function () {
            $scope.search = "";
            $scope.saveSearch();
        };

        urlHandler.setParams(["androidBikeType", "androidSort", "iosBikeType", "iosSort", "view"]);
        $scope.selectedAndroidBikeType = urlHandler.get("androidBikeType") || urlHandler.read("androidBikeType");
        $scope.selectedAndroidSort = urlHandler.get("androidSort") || urlHandler.read("androidSort");
        $scope.selectedIosBikeType = urlHandler.get("iosBikeType") || urlHandler.read("iosBikeType");
        $scope.selectedIosSort = urlHandler.get("iosSort") || urlHandler.read("iosSort");
        $scope.activeView = urlHandler.get("view") || urlHandler.read("view") || 'combined';

        $scope.toggleView = function () {
            $scope.activeView = $scope.activeView !== 'separated' ? 'separated' : 'combined';
            urlHandler.set({view: $scope.activeView});
            $scope.getRider();
        };

        $scope.sort = function (type) {
            if ($scope.activeView === 'separated') {
                $scope.sortSeparated(type);
            } else {
                urlHandler.set({
                    androidBikeType: '',
                    androidSort: '',
                    iosBikeType: '',
                    iosSort: ''
                });

                $scope.getRider();
            }
        };
        $scope.sortSeparated = function (type) {
            // <th table-sorter="android|normal">
            var raw = type.split("|"),
                os, bikeType, sort, isNew;

            os = raw[0];
            bikeType = raw[1];

            if (os === "android") {
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

        $scope.lastUpdate = "";
        $scope.allRiderCount = 0;
        $scope.allRiderSeparated = {
            android: [],
            ios: []
        };
        $scope.allRiderCombined = {
            normal: [],
            donkey: [],
            crazy: [],
            total: [],
            countries: []
        };

        $scope.getRider = function () {
            $scope.lastUpdate = bonxyApi.getLeadersLastUpdate();

            if ($scope.activeView === 'separated') {
                var sortedRider = WRTimes.getRiderSortedByOS(
                    $scope.data.rider,
                    $scope.selectedAndroidBikeType,
                    $scope.selectedAndroidSort,
                    $scope.selectedIosBikeType,
                    $scope.selectedIosSort
                );
                $scope.allRiderCount = sortedRider.allRiderCount;
                $scope.allRiderSeparated = sortedRider.allRider;
            } else {
                var sortedRider = WRTimes.getRiderSortedByType(
                    $scope.data.rider
                );

                $scope.allRiderCount = sortedRider.allRiderCount;
                $scope.allRiderCombined = sortedRider.allRider;
            }
        };

        // watch on rider loader
        var $watcher = $scope.$watch("data.rider", function (rider) {
            if (rider && Object.keys(rider).length > 0) {
                $scope.getRider();
                $watcher();
            }
        });
    })