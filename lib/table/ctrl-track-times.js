angular.module("trialsTrackmap")
    .controller("trackTimes", function (
        $scope, $rootScope, $document,
        loader, urlHandler, improveTimes, trackData, categories
    ) {
        urlHandler.setParams(["part", "partLevel", "cat", "tier"]);

        $scope.selectedCat = urlHandler.get("cat");
        $scope.setCat = function () {
            urlHandler.set({cat: $scope.selectedCat});
        };
        $scope.categories = categories.getAll();

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
        urlHandler.setParams(["sort", "sortType", "os", "bike", "bikeModel", "empty"]);

        $scope.selectedOS = urlHandler.get("os") || urlHandler.read("selectedOS") || "android";
        improveTimes.setOS($scope.selectedOS);
        $scope.setOS = function () {
            urlHandler.set({mode: $scope.selectedOS});
            urlHandler.save("selectedOS", $scope.selectedOS);
            improveTimes.setOS($scope.selectedOS);
        };

        $scope.selectedBike = urlHandler.get("bike") || urlHandler.read("selectedBike") || "normal";
        improveTimes.setBikeType($scope.selectedBike);
        $scope.setBikeType = function () {
            urlHandler.set({bike: $scope.selectedBike});
            urlHandler.save("selectedBikeType", $scope.selectedBike);
            improveTimes.setBikeType($scope.selectedBike);
        };

        $scope.selectedBikeModel = urlHandler.get("bikeModel") || urlHandler.read("selectedBikeModel") || "";
        improveTimes.setBikeModel($scope.selectedBikeModel);
        $scope.setBikeModel = function () {
            urlHandler.set({bikeModel: $scope.selectedBikeModel});
            urlHandler.save("selectedBikeModel", $scope.selectedBikeModel);
            improveTimes.setBikeModel($scope.selectedBikeModel);
        };

        $scope.selectedSort = urlHandler.get("sort") || urlHandler.read("selectedSort");
        $scope.selectedSortType = urlHandler.get("sortType") || urlHandler.read("selectedSortType");
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
            urlHandler.save("selectedSortType", $scope.selectedSortType);
            urlHandler.save("selectedSort", $scope.selectedSort);
        };

        // min values
        $scope.minRank = urlHandler.read("minRank");
        $scope.clearMinRank = function () {
            urlHandler.save("minRank", parseInt($scope.minRank, 10));
        };

        $scope.minDiff = urlHandler.read("minDiff");
        $scope.clearMinDiff = function () {
            var newDiff;
            if ($scope.minDiff) {
                newDiff = improveTimes.convertTime($scope.minDiff);
            }
            urlHandler.save("minDiff", newDiff);
            $scope.minDiff = newDiff;
        };

        urlHandler.setParams(["myGoal", "showUltimate"]);

        $scope.showMyGoal = Boolean(urlHandler.get("myGoal")) || urlHandler.read("showMyGoal") || false;
        $scope.saveMyGoal = function () {
            urlHandler.set({myGoal: $scope.showMyGoal});
            urlHandler.save("showMyGoal", $scope.showMyGoal);
        };

        $scope.showUltimate = Boolean(urlHandler.get("showUltimate")) || urlHandler.read("showUltimate") || false;
        $scope.saveUltimateCheckbox = function () {
            urlHandler.set({showUltimate: $scope.showUltimate});
            urlHandler.save("showUltimate", $scope.showUltimate);
        };

        $scope.tflforoProfileId = urlHandler.read("tflforoProfileId");
        $scope.profileName = urlHandler.read("profileName");
        $scope.profileRank = urlHandler.read("profileRank");

        // print
        $scope.isEmpty = urlHandler.get("empty");

        $rootScope.$on("data:reload", function () {
            $scope.data.tracks = trackData.generateTracks(true);
            $scope.data.rider = improveTimes.WRTimes.getRider();
        });
    })