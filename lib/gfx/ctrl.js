angular.module("trialsTrackmap")
    .controller("gfx", function ($rootScope, $scope, loader) {
        $scope.data = {};

        loader.get(["gfx"]).then(function (data) {
            $scope.data.images = data.images;
            $scope.data.hoster = data.hoster;
            $rootScope.$emit("data:loaded", $scope.data);
        });
    })