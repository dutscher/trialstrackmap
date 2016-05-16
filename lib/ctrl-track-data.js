angular.module("trialsTrackmap")
    .controller("trackData", function ($scope, $rootScope, $document,
                                       loader, improveTimes, categories, garage, trackData) {

        // data loader
        $scope.dataLoaded = false;
        $scope.tracksReady = false;
        $scope.data = {};

        var loadPublicWorldrecords = $document[0].querySelector("html[data-without='worldrecords']") === null;

        loader.get(["map", "gfx"]).then(function (data) {
            Object.keys(data.database).forEach(function (_dataKeyName_) {
                $scope.data[_dataKeyName_] = data.database[_dataKeyName_];
            });
            
            $scope.data.images = data.images;
            $scope.data.hoster = data.hoster;
            $scope.data.rider = {};

            if (!loadPublicWorldrecords) {
                $rootScope.$emit("data:loaded", $scope.data);
                $scope.dataLoaded = true;
            } else {
                // add public worldrecord data
                improveTimes.WRTimes.get().then(function () {
                    $scope.data.rider = improveTimes.WRTimes.getRider();
                    $rootScope.$emit("data:loaded", $scope.data);
                    $scope.dataLoaded = true;
                });
            }
        });

        $rootScope.$on("data:loaded", function () {
            categories.setAll($scope.data.map.cats);
            garage.setAll($scope.data.bikes, $scope.data.media.paintjobs);
            trackData.setData($scope.data);
            $scope.data.tracks = trackData.generateTracks();

            $rootScope.$emit("tracks:ready", $scope.data);

            $scope.tracksReady = true;

            $rootScope.$on("$translateChangeSuccess", function () {
                $scope.data.tracks = trackData.generateTracks(true);
            });
        });
    })