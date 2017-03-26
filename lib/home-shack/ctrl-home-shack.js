angular.module("trialsTrackmap")
    .controller("home-shack", function ($rootScope, $scope, loader) {
        $scope.data = {};

        loader.get(["wardrobe"]).then(function (data) {
            $scope.data = data;
            $rootScope.$emit("costums:loaded", $scope.data);
        });
    })