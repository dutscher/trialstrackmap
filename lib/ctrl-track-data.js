angular.module("trialsTrackmap")
    .controller("trackData", function ($scope, $rootScope, $document, $q,
                                       loader, improveTimes, categories, garage, trackData, myJson) {

        // data loader
        $scope.dataLoaded = false;
        $scope.tracksReady = false;
        $scope.data = {};

        // add <html data-without='myjson'> to your template to disable fetches to myjson
        var withoutMyJson = $document[0].querySelector("html[data-without='myjson']") !== null,
            // add <html data-without='worldrecords'> to disable fetches to load the worldrecords
            loadPublicWorldrecords = !withoutMyJson
                ? $document[0].querySelector("html[data-without='worldrecords']") === null
                : false,
            // load tags
            tagPromise = !withoutMyJson ? myJson.getTags() : $q.resolve([]),
            databasePromise = loader.get(["map", "gfx"]),
            allPromises = $q.all([databasePromise, tagPromise]);

        allPromises
            .then(function (data) {
                var databaseData = data[0],
                    tagData = data[1];

                databaseData.database.tagsPublic = tagData;
                //myJson.setTagsData(JSON.stringify(databaseData.database.tags));

                Object.keys(databaseData.database).forEach(function (_dataKeyName_) {
                    $scope.data[_dataKeyName_] = databaseData.database[_dataKeyName_];
                });

                $scope.data.offline = databaseData.offline;
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
            categories.setAll($scope.data.trackdata.categories.all);
            categories.setAlias($scope.data.trackdata.categories.alias);

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
    });