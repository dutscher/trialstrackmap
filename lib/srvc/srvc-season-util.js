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

            extendLevel: function (extraType, extra, spritePointer) {
                var level = {};

                switch (extraType) {
                case "donkey-new":
                case "donkey":
                    level.title = data.prizes.donkey + " " + extra;
                    level.css_selector = extraType;
                    level.price_indicator = extraType;
                    level.sprite = "seasons";
                    break;
                case "doughnut":
                    level.title = data.prizes.doughnut;
                    level.css_selector = extraType;
                    level.price_indicator = extraType;
                    level.sprite = "seasons";
                    break;
                case "paintjob":
                    level.title = data.prizes.paintjobs[extra];
                    level.css_selector = "paintjob-icon-" + spritePointer;
                    level.price_indicator = level.css_selector;
                    level.sprite = "paintjob-icon";
                    break;
                case "part":
                    level.title = data.prizes.parts + " " + ucfirst(extra).replace("-", " Level ");
                    level.css_selector = extraType + "-" + extra;
                    level.price_indicator = extraType;
                    level.sprite = "part";
                    break;
                case "unlimited-fuel":
                    level.title = data.prizes[extraType.replace("-", "_")];
                    level.css_selector = extraType;
                    level.price_indicator = extraType;
                    level.sprite = "seasons";
                    break;
                case "track":
                    level.title = data.prizes.tracks[extra];
                    level.css_selector = extraType;
                    level.price_indicator = extraType;
                    level.sprite = "seasons";
                    break;
                case "custom":
                    level.title = data.prizes.customs[extra];
                    level.css_selector = extraType + "-" + extra;
                    level.price_indicator = extraType;
                    level.sprite = "seasons";
                    break;
                case "coins-gems":
                case "coins":
                    level.css_selector = extraType;
                    level.sprite = "seasons";
                    break;
                }

                if (!("price_indicator" in level) && !("title" in level)) {
                    level.price_indicator = "";
                    level.title = "";
                }

                if (extraType && !level.hasOwnProperty("title")) {
                    console.warn("Price is not defined", arguments);
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