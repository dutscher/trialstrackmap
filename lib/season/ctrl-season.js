angular.module("trialsTrackmap")
    .controller("seasons", function ($rootScope, $scope, loader, $document) {
        $scope.data = {};
        $scope.filteredArray = [];

        function startsWith(str, needle){
            return str.slice(0, needle.length) == needle;
        }

        function ucfirst(str) {
            str += "";
            var f = str.charAt(0)
                .toUpperCase();
            return f + str.substr(1);
        }

        function collectSummaries() {

            $scope.filteredArray.forEach(function (season, seasonIndex) {
                season.summary = {
                    coins: 0,
                    gems: 0,
                    extras: []
                };

                season.prizes.forEach(function (level, levelIndex) {
                    // fill emtpy gems to data model
                    if (!("gems" in level)){
                        $scope.filteredArray[seasonIndex].prizes[levelIndex].gems = 0;
                        level.gems = 0;
                    }

                    season.summary.coins += level.coins;
                    season.summary.gems += level.gems;

                    if ("extra" in level || "extra_type" in level) {
                        // create title and css selector
                        switch (level.extra_type) {
                            case "donkey-new":
                            case "donkey":
                                level.title = $scope.data.prizes.donkey + " " + level.extra;
                                level.css_selector = level.extra_type;
                                level.prizeIndicator = level.extra_type;
                                level.sprite = "seasons";
                                break;
                            case "doughnut":
                                level.title = $scope.data.prizes.doughnut;
                                level.css_selector = level.extra_type;
                                level.prizeIndicator = level.extra_type;
                                level.sprite = "seasons";
                                break;
                            case "paintjob":
                                level.title = $scope.data.prizes.paintjob[level.extra];
                                level.css_selector = level.extra_type + "-" + level.extra;
                                level.prizeIndicator = level.css_selector;
                                level.sprite = "seasons";
                                break;
                            case "part":
                                level.title = $scope.data.prizes.parts + " " + ucfirst(level.extra).replace("-"," Level ");
                                level.css_selector = level.extra_type + "-" + level.extra;
                                level.prizeIndicator = level.extra_type;
                                level.sprite = "part";
                                break;
                        }

                        // concat prizes
                        var foundPrizeIndex = -1,
                            foundPrize = season.summary.extras.filter(function (extra, index) {
                                var bool = startsWith(extra.css_selector,level.prizeIndicator);
                                if(bool)
                                    foundPrizeIndex = index;
                            return bool;
                        });
                        if (foundPrize.length > 0) {
                            season.summary.extras[foundPrizeIndex].amount += 1;
                        } else {
                            season.summary.extras.push({
                                title: level.title,
                                css_selector: level.css_selector,
                                sprite: level.sprite,
                                amount: 1
                            });
                        }
                    }
                });

            });
        }

        var mouseWheelEvt = function (event) {
            if ($document[0].body.doScroll)
                $document[0].body.doScroll(event.wheelDelta > 0 ? "left" : "right");
            else if ((event.wheelDelta || event.detail) > 0)
                $document[0].body.scrollLeft -= 50;
            else
                $document[0].body.scrollLeft += 50;

            return false;
        };
        $document[0].body.addEventListener("mousewheel", mouseWheelEvt);

        loader.get(["gfx", "seasons"]).then(function (data) {
            $scope.data.images = data.images;
            $scope.data.hoster = data.hoster;
            $scope.data.prizes = data.prizes;
            $scope.data.seasons = data._seasons;

            $scope.filteredArray = $scope.data.seasons.reverse();

            collectSummaries();

            $rootScope.$emit("data:loaded", $scope.data);
        });

    })