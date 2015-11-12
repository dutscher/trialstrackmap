angular.module("trialsTrackmap")
    .service("loader", function ($basePath, $http, $q) {
        return {
            get: function (params) {
                var jsons = [];
                if (typeof params == "object")
                    jsons = params;
                else
                    jsons.push(params);

                var defer = $q.defer(),
                    time = (new Date()).getTime(),
                    ready = [],
                    dataReady = {};

                jsons.forEach(function (jsonFile) {
                    ready.push($http.get($basePath + "/dist/" + jsonFile + ".json?ts=" + time).success(function (data) {
                        angular.extend(dataReady, data);
                    }));
                });

                $q.all(ready).then(function () {
                    defer.resolve(dataReady);
                });

                return defer.promise;
            }
        }
    })