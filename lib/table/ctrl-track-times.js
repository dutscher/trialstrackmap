angular.module("trialsTrackmap")
    .controller("trackTimes", function ($scope, urlHandler, improveTimes, $timeout) {
        urlHandler.setParams(["part", "partLevel", "search", "cat", "tier"]);

        $scope.selectedCat = urlHandler.get("cat");
        $scope.setCat = function () {
            urlHandler.set({cat: $scope.selectedCat});
        };

        $scope.selectedTier = urlHandler.get("tier");
        $scope.setTier = function () {
            urlHandler.set({tier: $scope.selectedTier});
        };

        $scope.selectedPart = urlHandler.get("part");
        $scope.selectedPartLevel = urlHandler.get("partLevel");
        $scope.setParts = function (changeLevel) {
            if (changeLevel) {
                urlHandler.set({partLevel: $scope.selectedPartLevel});
                return false;
            }
            urlHandler.set({part: $scope.selectedPart});
        };

        $scope.search = urlHandler.get("search");
        $scope.saveSearch = function () {
            urlHandler.set({search: $scope.search});
        };
        $scope.clearSearch = function () {
            $scope.search = "";
            $scope.saveSearch();
        };

        // improve
        urlHandler.setParams(["sort", "sortType", "mode", "bike", "empty"]);

        $scope.selectedMode = urlHandler.get("mode") || urlHandler.read("mode") || "android";
        improveTimes.setMode($scope.selectedMode);
        $scope.setMode = function () {
            urlHandler.set({mode: $scope.selectedMode});
            urlHandler.save("mode", $scope.selectedMode);
            improveTimes.setMode($scope.selectedMode);
        };

        $scope.selectedBike = urlHandler.get("bike") || urlHandler.read("bike") || "normal";
        improveTimes.setBike($scope.selectedBike);
        $scope.setBike = function () {
            urlHandler.set({bike: $scope.selectedBike});
            urlHandler.save("bike", $scope.selectedBike);
            improveTimes.setBike($scope.selectedBike);
        };

        $scope.selectedSort = urlHandler.get("sort");
        $scope.selectedSortType = urlHandler.get("sortType");
        $scope.sort = function (type) {
            var isNewType = $scope.selectedSortType !== type;
            $scope.selectedSortType = type;
            // init
            if (isNewType
                || $scope.selectedSort === "") {
                $scope.selectedSort = "asc";
                // toggle
            } else if (!isNewType
                && $scope.selectedSort === "asc") {
                $scope.selectedSort = "desc";
                // clear
            } else if (!isNewType
                && $scope.selectedSort === "desc") {
                $scope.selectedSortType = "";
                $scope.selectedSort = "";
            }
            urlHandler.set({sortType: $scope.selectedSortType, sort: $scope.selectedSort});
        };

        // print
        $scope.isEmpty = urlHandler.get("empty");
    })