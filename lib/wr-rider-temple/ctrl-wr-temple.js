angular.module("trialsTrackmap")
    .controller("wrTemple", function ($scope, urlHandler, improveTimes) {

        $scope.search = urlHandler.get("search");
        $scope.saveSearch = function () {
            urlHandler.set({search: $scope.search});
        };
        $scope.clearSearch = function () {
            $scope.search = "";
            $scope.saveSearch();
        };

    })