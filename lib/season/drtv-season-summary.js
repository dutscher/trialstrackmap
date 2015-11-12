angular.module("trialsTrackmap")
    .directive("seasonSummary", function(seasonUtil){

        function startsWith(str, needle){
            return str.slice(0, needle.length) == needle;
        }

        var calcSummary = function(prizes){
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

                var _level_ = seasonUtil.extendLevel(level.extra, level.extra_type);

                summary.coins += level.coins;
                summary.gems += level.gems;

                if ("extra" in level || "extra_type" in level) {
                    // concat prizes
                    var foundPrizeIndex = -1,
                        foundPrize = summary.extras.filter(function (extra, index) {
                            var bool = startsWith(extra.css_selector, _level_.prizeIndicator);
                            if (bool)
                                foundPrizeIndex = index;
                            return bool;
                        });

                    if (foundPrize.length > 0) {
                        summary.extras[foundPrizeIndex].amount += 1;
                    } else {
                        summary.extras.push({
                            title: _level_.title,
                            extra: level.extra,
                            extra_type: level.extra_type,
                            css_selector: _level_.css_selector,
                            prizeIndicator: _level_.prizeIndicator,
                            amount: 1
                        });
                    }
                }
            });

            // sort them
            var byName = summary.extras.slice(0);
                byName.sort(function(a,b) {
                    var x = a.css_selector.toLowerCase();
                    var y = b.css_selector.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });
            summary.extras = byName;

            return summary;
        };

        return {
            restrict: "C",
            scope: {
                seasonId: "@seasonId"
            },
            template: '\
                + {%::summary.coins%} <i class="coins"></i><br/> \
                + {%::summary.gems%} <i class="gems"></i><br/> \
                <div ng-repeat="extra in summary.extras" title=""> \
                    + \
                    <span ng-if="extra.amount > 1">{%::extra.amount%} x</span> \
                    <span class="season-prize" data-extra="{%::extra.extra%}" data-extra-type="{%::extra.extra_type%}"></span> \
                </div> \
            ',
            link: function(scope){
                seasonUtil.getPrizes(scope.seasonId)
                    .then(function(_prizes_){
                        scope.summary = calcSummary(_prizes_);
                    });
            },

        }
    })