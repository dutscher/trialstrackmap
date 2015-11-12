angular.module("trialsTrackmap")
    .service("seasonUtil", function ($q, $rootScope) {

        function ucfirst(str) {
            str += "";
            var f = str.charAt(0)
                .toUpperCase();
            return f + str.substr(1);
        }

        var data = {},
            isReady = false;

        return {
            setData: function (json) {
                data = json;
            },

            getData: function () {
                return data;
            },

            isReady: function () {
                var defer = $q.defer();

                if (isReady) {
                    defer.resolve();
                } else {
                    $rootScope.$on("data:loaded", function () {
                        defer.resolve();
                        isReady = true;
                    });
                }

                return defer.promise;
            },

            extendLevel: function (extra, extraType) {
                var level = {};

                switch (extraType) {
                    case "donkey-new":
                    case "donkey":
                        level.title = data.prizes.donkey + " " + extra;
                        level.css_selector = extraType;
                        level.prizeIndicator = extraType;
                        level.sprite = "seasons";
                        break;
                    case "doughnut":
                        level.title = data.prizes.doughnut;
                        level.css_selector = extraType;
                        level.prizeIndicator = extraType;
                        level.sprite = "seasons";
                        break;
                    case "paintjob":
                        level.title = data.prizes.paintjob[extra];
                        level.css_selector = extraType + "-" + extra;
                        level.prizeIndicator = level.css_selector;
                        level.sprite = "seasons";
                        break;
                    case "part":
                        level.title = data.prizes.parts + " " + ucfirst(extra).replace("-", " Level ");
                        level.css_selector = extraType + "-" + extra;
                        level.prizeIndicator = extraType;
                        level.sprite = "part";
                        break;
                }

                return level;
            },

            getPrizes: function (seasonId) {
                var defer = $q.defer();

                this.isReady().then(function () {
                    var foundSeason = data.seasons.filter(function (season) {
                        return season.id == seasonId;
                    });

                    if (foundSeason.length > 0) {
                        defer.resolve(foundSeason[0].prizes);
                    } else {
                        defer.reject("no season found");
                    }
                });

                return defer.promise;
            }
        }
    })