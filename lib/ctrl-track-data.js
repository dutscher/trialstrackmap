angular.module("trialsTrackmap")
    .controller("trackData", function ($scope, $rootScope, $document, $q,
                                       loader, improveTimes, categories, garage, trackData, myJson) {

        // data loader
        $scope.dataLoaded = false;
        $scope.tracksReady = false;
        $scope.data = {};

        var loadPublicWorldrecords = $document[0].querySelector("html[data-without='worldrecords']") === null,
            tagPromise = myJson.getTags(),
            databasePromise = loader.get(["map", "gfx"]),
            allPromises = $q.all([databasePromise, tagPromise]);


        //myJson.setTagsData(JSON.stringify(json));

        allPromises
            .then(function (data) {
                var databaseData = data[0],
                    tagData = data[1];

                databaseData.database["tags"] = tagData;

                Object.keys(databaseData.database).forEach(function (_dataKeyName_) {
                    $scope.data[_dataKeyName_] = databaseData.database[_dataKeyName_];
                });

                $scope.data.images = databaseData.images;
                $scope.data.hoster = databaseData.hoster;
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
            categories.setAll($scope.data.categories.all);
            categories.setAlias($scope.data.categories.alias);
            categories.setTags($scope.data.tags);
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