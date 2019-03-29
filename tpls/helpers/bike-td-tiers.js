(function () {
    module.exports.register = function (Handlebars) {
        Handlebars.registerHelper("bike-td-tiers", function (allBikes) {
            var tiers = {},
                html = "";
            // parse all tier variations
            for (var bikeId in allBikes) {
                var tier = allBikes[bikeId].tier;
                if (!(tier in tiers)) {
                    tiers[tier] = 1;
                } else {
                    tiers[tier]++;
                }
            }
            // build html
            for (var tierId in tiers) {
                var tierNums = tiers[tierId];
                var tierLabel = tierId == 256 ? "Crazy" : tierId;
                html += "<td class=\"sprite-col-topheader\" colspan=\"" + tierNums + "\">" + tierLabel + "</td>";
            }

            return html;
        });
    }
}).call(this);