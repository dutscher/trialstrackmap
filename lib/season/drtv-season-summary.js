angular.module("trialsTrackmap")
    .directive("seasonSummary", function (seasonUtil) {

        function startsWith(str, needle) {
            if (typeof str !== "string") {
                return false;
            }
            return str.slice(0, needle.length) === needle;
        }

        var calcSummary = function (prizes) {
            var summary = {
                coins: 0,
                gems: 0,
                extras: []
            };

            prizes.forEach(function (level, levelIndex) {
                // fill emtpy gems to data model
                if (!("gems" in level)) {
                    level.gems = 0;
                }

                var _level_ = seasonUtil.extendLevel(level.extra_type, level.extra, level.sprite_pointer);

                summary.coins += level.coins;
                summary.gems += level.gems;

                if ("extra" in level || "extra_type" in level) {
                    if (_level_.price_indicator === "") {
                        return;
                    }

                    // concat prizes
                    var foundPrizeIndex = -1,
                        foundPrize = summary.extras.filter(function (extra, index) {
                            var bool = startsWith(extra.css_selector, _level_.price_indicator);
                            if (bool) {
                                foundPrizeIndex = index;
                            }
                            return bool;
                        });

                    if (foundPrize.length > 0 && !_level_.hasOwnProperty("seperate_listed")) {
                        summary.extras[foundPrizeIndex].amount += 1;
                    } else {
                        summary.extras.push({
                            title: _level_.title,
                            extra: level.extra,
                            extra_type: level.extra_type,
                            css_selector: _level_.css_selector,
                            sprite_pointer: level.sprite_pointer,
                            prizeIndicator: _level_.prizeIndicator,
                            amount: 1,
                            season_level: levelIndex + 1
                        });
                    }
                }
            });

            // sort them
            summary.extras = [].concat(
                summary.extras.filter(function (extra) {
                    return extra.extra_type === "track";
                }),
                summary.extras.filter(function (extra) {
                    return extra.extra_type === "costum";
                }),
                summary.extras.filter(function (extra) {
                    return extra.extra_type === "doughnut" || extra.extra_type === "part";
                })
            );

            return summary;
        };

        return {
            restrict: "C",
            scope: {
                seasonId: "@seasonId"
            },
            template: "\
                + {%::summary.coins%} <i class=\"coins\"></i><br/> \
                + {%::summary.gems%} <i class=\"gems\"></i><br/> \
                <div ng-repeat=\"extra in summary.extras\"> \
                    + \
                    <span ng-if=\"extra.amount > 1\">{%::extra.amount%} x</span> \
                    <span class=\"season-prize\" \
                        data-extra=\"{%::extra.extra%}\" \
                        data-extra-type=\"{%::extra.extra_type%}\" \
                        data-sprite-pointer=\"{%::extra.sprite_pointer%}\" \
                        data-index=\"{%::extra.season_level%}\"></span> \
                </div> \
            ",
            link: function (scope) {
                seasonUtil.getPrizes(scope.seasonId)
                    .then(function (_prizes_) {
                        scope.summary = calcSummary(_prizes_);
                    });
            },

        };
    });