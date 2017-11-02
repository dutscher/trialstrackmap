angular.module("trialsTrackmap")
    .controller("seasons", function ($rootScope, $scope, loader, $document, seasonUtil) {
        $scope.data = {};

        loader.get(["gfx", "seasons"]).then(function (data) {
            $scope.data.images = data.images;
            $scope.data.hoster = data.hoster;

            seasonUtil.setData({seasons: data._seasons, prizes: data._prizes});

            $rootScope.$emit("data:loaded", $scope.data);
        });
    });