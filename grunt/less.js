module.exports = function (grunt) {

    function generateSprites() {

        var globalVars = {},
            paintJobsJSON = require("../database/media/paintjobs.json"),
            bikeNamesJSON = require("../database/bikes.json"),
            paintJobDimensions = "70x50".split("x"),
            spritePaintJobDimensions = "910x550".split("x"),
            spritePaintJobScalePercent = 100,
            paintJobIconDimensons = "100x100".split("x"),
            spritePaintJobIconDimensions = "1100x1300".split("x"),
            spritePaintJobIconScalePercent = 50,
            paintJobsRAW = paintJobsJSON.bikes;

        function trimName(name) {
            return "" + name.toLowerCase()
                    .replace(" ", "-")
                    .replace("(", "")
                    .replace(")", "");
        }

        function calcPercantage(pixel, scalePercent) {
            var faktor = scalePercent / 100;
            return pixel * faktor;
        }

        // paintjobs
        globalVars._spritePaintJobsDimensionWidth = calcPercantage(spritePaintJobDimensions[0], spritePaintJobScalePercent);
        globalVars._spritePaintJobsDimensionHeight = calcPercantage(spritePaintJobDimensions[1], spritePaintJobScalePercent);
        globalVars._paintJobWidth = calcPercantage(paintJobDimensions[0], spritePaintJobScalePercent);
        globalVars._paintJobHeight = calcPercantage(paintJobDimensions[1], spritePaintJobScalePercent);
        globalVars._paintJobSelectors = [];
        globalVars._paintJobNames = [];
        globalVars._paintJobPositions = [];
        // paintjob icons
        globalVars._spritePaintJobsIconDimensionWidth = calcPercantage(spritePaintJobIconDimensions[0], spritePaintJobIconScalePercent);
        globalVars._spritePaintJobsIconDimensionHeight = calcPercantage(spritePaintJobIconDimensions[1], spritePaintJobIconScalePercent);
        globalVars._paintJobIconWidth = calcPercantage(paintJobIconDimensons[0], spritePaintJobIconScalePercent);
        globalVars._paintJobIconHeight = calcPercantage(paintJobIconDimensons[1], spritePaintJobIconScalePercent);
        globalVars._paintJobIconNames = [];
        globalVars._paintJobIconSelectors = [];
        globalVars._paintJobIconPositions = [];

        for (var bikeID in paintJobsRAW) {

            if (!(bikeID in bikeNamesJSON)) {
                console.error("The bikeID: " + bikeID + " isnt in bikeNamesJSON");
                return;
            }

            var bikeName = trimName(bikeNamesJSON[bikeID].name),
                bikeIndex = Object.keys(paintJobsRAW).indexOf(bikeID);

            for (var paintJob in paintJobsRAW[bikeID]) {
                var paintJobName = trimName(paintJobsRAW[bikeID][paintJob].name),
                    paintJobIndex = Object.keys(paintJobsRAW[bikeID]).indexOf(paintJob);
                // paintjobs
                globalVars._paintJobNames.push("paintjob-" + bikeName + "-" + paintJobName);
                globalVars._paintJobSelectors.push("paintjob-" + bikeID + "-" + paintJobIndex);

                var left = (globalVars._paintJobWidth * bikeIndex),
                    top = (globalVars._paintJobHeight * paintJobIndex);

                globalVars._paintJobPositions.push((left > 0 ? "-" : "") + left + (left !== 0 ? "px" : "") + " " + (top > 0 ? "-" : "") + top + (top !== 0 ? "px" : ""));
                // icons
                globalVars._paintJobIconNames.push("paintjob-icon-" + bikeName + "-" + paintJobName);
                globalVars._paintJobIconSelectors.push("paintjob-icon-" + bikeID + "-" + paintJobIndex);

                var left = (globalVars._paintJobIconWidth * paintJobIndex),
                    top = (globalVars._paintJobIconHeight * bikeIndex);

                globalVars._paintJobIconPositions.push((left > 0 ? "-" : "") + left + (left !== 0 ? "px" : "") + " " + (top > 0 ? "-" : "") + top + (top !== 0 ? "px" : ""));
            }
        }

        return globalVars;
    }

    var globalVars = generateSprites();

    grunt.registerTask("convertLess", function () {
        globalVars = generateSprites();
        grunt.task.run("less:dist");
    });

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