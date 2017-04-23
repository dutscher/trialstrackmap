module.exports = function () {
    var _ = require("lodash");
    
    return {
        generateSprites: function () {
            return _.extend({},
                this.generatePaintjobs(),
                this.generateCostums());
        },
        generatePaintjobs: function () {
            var globalVars = {},
                paintJobsJSON = require("../../database/media/paintjobs.json"),
                gfxJSON = require("../../database/media/gfx.json"),
                bikeNamesJSON = require("../../database/bikes.json"),
                paintJobsRAW = paintJobsJSON.bikes,
                //gfx dimensions
                spritePaintJobIconDimensions = "1100x1400".split("x"),
                spritePaintJobDimensions = "980x550".split("x"),
                //sprite dimensions
                paintJobDimensions = "70x50".split("x"),
                paintJobIconDimensons = "100x100".split("x"),
                //scale dimensions
                spritePaintJobScalePercent = 90,
                spritePaintJobIconScalePercent = 50;
            
            function trimName(name) {
                var name = "" + name.toLowerCase()
                        .replace(/ /g, "-")
                        .replace(/\(/g, "")
                        .replace(/\)/g, "");
                return name;
            }
            
            function calcPercantage(pixel, scalePercent) {
                var factor = scalePercent / 100;
                return pixel * factor;
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
            // gfx
            globalVars._gfxPaintjobs = gfxJSON.images.paintjobs.src.replace("#1/", "");
            globalVars._gfxPaintjobIcons = gfxJSON.images["paintjob-icons"].src.replace("#1/", "");
            
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
        },
        generateCostums: function () {
            var globalVars = {},
                wardrobeJSON = require("../../database/media/wardrobe.json"),
                costumOrder = wardrobeJSON.homeshack,
                costumsData = wardrobeJSON.all,
                costumStyle = ".custom-sprites{};\n";
            
            for (var i = 0; i < costumOrder.length; i++) {
                var costumId = costumOrder[i],
                    costumData = costumsData[costumId],
                    costumName = costumData.name.toLowerCase().replace(/ /g, "-"),
                    costumSelector = 'costum--' + costumId,
                    costumParts = costumData.parts,
                    costumHead = costumParts[0].split("|"),
                    costumBody = costumParts[1].split("|"),
                    costumArm = costumParts[2].split("|"),
                    costumPant = costumParts[3].split("|");
                
                // src|left|top|width
                costumStyle += (costumParts ? (
                    '.' + costumName + ' .costum--head,\n' +
                    '.' + costumSelector + ' .costum--head,\n' +
                    '.' + costumSelector + '.costum--head {\n' +
                    '   background-image: url("' + costumHead[0] + '");\n' +
                    (
                        costumHead.length > 1
                            ? (
                                (costumHead[1] ? '   left: ' + costumHead[1] + 'px;\n' : '') +
                                (costumHead[2] ? '   top: ' + costumHead[2] + 'px;\n' : '')
                            )
                            : ''
                    ) +
                    '}\n' +
                    '.' + costumName + ' .costum--body,\n' +
                    '.' + costumSelector + ' .costum--body,\n' +
                    '.' + costumSelector + '.costum--body {\n' +
                    '   background-image: url("' + costumBody[0] + '");\n' +
                    (
                        costumBody.length > 1
                            ? (
                                (costumBody[1] ? '   left: ' + costumBody[1] + 'px;\n' : '') +
                                (costumBody[2] ? '   top: ' + costumBody[2] + 'px;\n' : '')
                            )
                            : ''
                    ) +
                    '}\n' +
                    '.' + costumName + ' .costum--arm,\n' +
                    '.' + costumSelector + ' .costum--arm,\n' +
                    '.' + costumSelector + '.costum--arm {\n' +
                    '   background-image: url("' + costumArm[0] + '");\n' +
                    (
                        costumArm.length > 1
                            ? (
                                (costumArm[1] ? '   left: ' + costumArm[1] + 'px;\n' : '') +
                                (costumArm[2] ? '   top: ' + costumArm[2] + 'px;\n' : '') +
                                (costumArm[3] ? '   width: ' + costumArm[3] + 'px;\n' : '')
                            )
                            : ''
                    ) +
                    '}\n' +
                    '.' + costumName + ' .costum--pant,\n' +
                    '.' + costumSelector + ' .costum--pant,\n' +
                    '.' + costumSelector + '.costum--pant {\n' +
                    '   background-image: url("' + costumParts[3] + '");\n' +
                    (
                        costumPant.length > 1
                            ? (
                                (costumPant[1] ? '   left: ' + costumPant[1] + 'px;\n' : '')
                            )
                            : ''
                    ) +
                    '}\n' ) : '' );
            }
    
            globalVars.costumsCSS = costumStyle;
            
            return globalVars;
        }
    }
};