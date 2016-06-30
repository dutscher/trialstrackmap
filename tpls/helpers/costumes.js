(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("costume", function (allCostumes, costumeId, type) {
            return allCostumes[costumeId][type];
        });

        Handlebars.registerHelper("costumePosition", function (costumeId, index, perRow) {
            var offsetX = 55,
                offsetY = 15,
                itemWidth = 91,
                itemHeight = 195,
                itemCol = index % perRow,
                whichRow = Math.ceil((index / perRow) % perRow),
                itemRow = (itemCol == 0 ? whichRow + 1 : whichRow) - 1,
                x = itemCol * itemWidth + offsetX,
                y = itemRow * itemHeight + offsetY,
            // x1,y1,x2,y2
                returnStr = x + "," + y + "," + (x + itemWidth) + "," + (y + itemHeight);

            return returnStr;
        });
    }
}).call(this);