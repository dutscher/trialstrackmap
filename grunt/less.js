module.exports = function (grunt) {

    function generateSprites() {

        var globalVars = {},
            paintJobsJSON = require("../database/media/paintjobs.json"),
            bikeNamesJSON = require("../database/bikes.json"),
            paintJobDimensons = "80x50".split("x"),
            spritePaintJobDimensions = "1120x550".split("x"),
            paintJobIconDimensons = "100x100".split("x"),
            spritePaintJobIconDimensions = "1100x1300".split("x"),
            spritePaintJobScalePercent = 50,
            paintJobsRAW = paintJobsJSON.bikes;

        function trimName(name) {
            return "" + name.toLowerCase()
                    .replace(" ", "-")
                    .replace("(", "")
                    .replace(")", "");
        }

        function calcPercantage(pixel, scalePercent){
            var faktor = scalePercent / 100;
            return pixel * faktor;
        }

        // paintjobs
        globalVars._spritePaintJobsDimensionWidth = spritePaintJobDimensions[0];
        globalVars._spritePaintJobsDimensionHeight = spritePaintJobDimensions[1];
        globalVars._paintJobWidth = paintJobDimensons[0];
        globalVars._paintJobHeight = paintJobDimensons[1];
        globalVars._paintJobSelectors = [];
        globalVars._paintJobNames = [];
        globalVars._paintJobPositions = [];
        // paintjob icons
        globalVars._spritePaintJobsIconDimensionWidth = calcPercantage(spritePaintJobIconDimensions[0], spritePaintJobScalePercent);
        globalVars._spritePaintJobsIconDimensionHeight = calcPercantage(spritePaintJobIconDimensions[1], spritePaintJobScalePercent);
        globalVars._paintJobIconWidth = calcPercantage(paintJobIconDimensons[0], spritePaintJobScalePercent);
        globalVars._paintJobIconHeight = calcPercantage(paintJobIconDimensons[1], spritePaintJobScalePercent);
        globalVars._paintJobIconNames = [];
        globalVars._paintJobIconSelectors = [];
        globalVars._paintJobIconPositions = [];

        for (var bikeID in paintJobsRAW) {
            var bikeName = trimName(bikeNamesJSON[bikeID]),
                bikeIndex = Object.keys(paintJobsRAW).indexOf(bikeID);

            for (var paintJob in paintJobsRAW[bikeID]) {
                var paintJobName = trimName(paintJobsRAW[bikeID][paintJob].name),
                    paintJobIndex = Object.keys(paintJobsRAW[bikeID]).indexOf(paintJob);
                // paintjobs
                globalVars._paintJobNames.push("paintjob-" + bikeName + "-" + paintJobName);
                globalVars._paintJobSelectors.push("paintjob-" + bikeID + "-" + (paintJobIndex + 1));

                var left = (globalVars._paintJobWidth * bikeIndex),
                    top = (globalVars._paintJobHeight * paintJobIndex);

                globalVars._paintJobPositions.push((left > 0 ? "-" : "") + left + "px " + (top > 0 ? "-" : "") + top + "px");
                // icons
                globalVars._paintJobIconNames.push("paintjob-icon-" + bikeName + "-" + paintJobName);
                globalVars._paintJobIconSelectors.push("paintjob-icon-" + bikeID + "-" + (paintJobIndex + 1));

                var left = (globalVars._paintJobIconWidth * paintJobIndex),
                    top = (globalVars._paintJobIconHeight * bikeIndex);

                globalVars._paintJobIconPositions.push((left > 0 ? "-" : "") + left + "px " + (top > 0 ? "-" : "") + top + "px");
            }
        }

        return globalVars;
    }

    var globalVars = generateSprites();

    return {
        dist: {
            options: {
                paths: ["css/mixins"],
                plugins: [require("less-plugin-glob")],
                globalVars: globalVars
            },
            files: {
                "dist/main.css": "css/main.less"
            }
        }
    }
};