(function () {
    module.exports.register = function (Handlebars, options) {
        var perRow = 14,
            offsetX = 55,
            offsetY = 0,
            itemWidth = 133,
            itemHeight = 260;

        Handlebars.registerHelper("costume", function (allCostumes, costumeId, type) {
            return allCostumes[costumeId][type];
        });

        Handlebars.registerHelper("costumePosition", function (costumeId, index) {
            var itemCol = index % perRow,
                whichRow = Math.ceil((index / perRow) % perRow),
                itemRow = (itemCol == 0 ? whichRow + 1 : whichRow) - 1,
                x = itemCol * itemWidth + offsetX,
                y = itemRow * itemHeight + offsetY,
            // x1,y1,x2,y2
                returnStr = x + "," + y + "," + (x + itemWidth) + "," + (y + itemHeight);

            return returnStr;
        });

        Handlebars.registerHelper("costumeNamePosition", function (costumeId, index) {
            var itemCol = index % perRow,
                whichRow = Math.ceil((index / perRow) % perRow),
                itemRow = (itemCol == 0 ? whichRow + 1 : whichRow) - 1,
                x = itemCol * itemWidth + offsetX,
                y = itemRow * itemHeight + offsetY,
                // x1,y1
                returnStr = "left: " + x + "px; top: " + (y + itemHeight) + "px;";

            return returnStr;
        });
    }
}).call(this);