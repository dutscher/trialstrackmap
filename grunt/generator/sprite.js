module.exports = function () {
    const _ = require("lodash"),
        fsExt = require("fs-extra"),
        pathForSprites = "css/sprites/",
        firstFileRow = "// this file is generated via grunt/generator/sprite.js\n";

    function replaceHoster (hoster, path) {
        if (!hoster || !path || path.indexOf("http") >= 0)
            return path;

        Object.keys(hoster).forEach(function (_index_) {
            path = path.replace(_index_, hoster[_index_]);
        });

        return path;
    }

    return {
        generateSprites: function () {
            const vars = this.generateVars();

            this.generatePaintjobsToImgur(vars);
            this.generateCostums();
            this.generateMapColors();

            return _.extend({},
                vars
            );
        },
        generateVars: () => {
            require("json5/lib/register");
            var globalVars = {},
                bikesJSON = require("../../build/bikes.json").build.bikes,
                gfxJSON = require("../../database/media/gfx.json"),
                imageJson = gfxJSON.images,
                bikes = bikesJSON.bikes;

            function trimName (name) {
                const nameLocal = "" + name.toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/\./g, "")
                    .replace(/\(/g, "")
                    .replace(/\)/g, "");
                return nameLocal
            }

            function calcPercantage (pixel, scalePercent) {
                var factor = scalePercent / 100;
                return pixel * factor;
            }

            // gfx
            globalVars._gfxPaintjobs = gfxJSON.images.paintjobs.src.replace("#1/", "");

            return globalVars;
        },
        generatePaintjobsToImgur: (vars) => {
            // TODO: get vars from generatePaintjobs and write file
            const pathDest = `${pathForSprites}paintjobs2imgur.less`;
            let css = firstFileRow;

            css += `
            .paintjob,
            .paintjob-icon {
                background-image: url(//i.imgur.com/${vars._gfxPaintjobs});
            }`;

            // write file
            fsExt.writeFileSync(pathDest, css);
        },
        generateCostums: () => {
            const wardrobeJSON = require("../../database/media/wardrobe.json"),
                gfxJSON = require("../../database/media/gfx.json"),
                costumOrder = wardrobeJSON.homeshack,
                costumsData = wardrobeJSON.all,
                pathDest = `${pathForSprites}costums.less`;
            let css = firstFileRow;

            for (var i = 0; i < costumOrder.length; i++) {
                var costumId = costumOrder[i],
                    costumData = costumsData[costumId],
                    costumName = costumData.name.toLowerCase().replace(/ /g, "-"),
                    costumIDSelector = "costum--" + costumData.originID,
                    costumParts = costumData.parts,
                    isSmall = costumParts.length === 3,
                    costumHead = costumParts[0].split("|"),
                    costumBody = costumParts[1].split("|"),
                    costumArm = !isSmall ? costumParts[2].split("|") : [],
                    costumPants = costumParts[!isSmall ? 3 : 2].split("|");

                // src|left|top|width
                css += (costumParts ? (
                        "." + costumName + " .costum--head,\n" +
                        "." + costumIDSelector + " .costum--head,\n" +
                        "." + costumIDSelector + ".costum--head {\n" +
                        "   background-image: url('" + replaceHoster(gfxJSON.hoster, costumHead[0]) + "');\n" +
                        (
                            costumHead.length > 1
                                ? (
                                    (costumHead[1] ? "   left: " + costumHead[1] + "px;\n" : "") +
                                    (costumHead[2] ? "   top: " + costumHead[2] + "px;\n" : "")
                                )
                                : ""
                        ) +
                        "}\n" +
                        "." + costumName + " .costum--body,\n" +
                        "." + costumIDSelector + " .costum--body,\n" +
                        "." + costumIDSelector + ".costum--body {\n" +
                        "   background-image: url('" + replaceHoster(gfxJSON.hoster, costumBody[0]) + "');\n" +
                        (
                            costumBody.length > 1
                                ? (
                                    (costumBody[1] ? "   left: " + costumBody[1] + "px;\n" : "") +
                                    (costumBody[2] ? "   top: " + costumBody[2] + "px;\n" : "")
                                )
                                : ""
                        ) +
                        "}\n" +
                        "." + costumName + " .costum--pants,\n" +
                        "." + costumIDSelector + " .costum--pants,\n" +
                        "." + costumIDSelector + ".costum--pants, \n" +
                        "." + costumIDSelector + ".costum--pant {\n" +
                        "   background-image: url('" + replaceHoster(gfxJSON.hoster, costumPants[0]) + "');\n" +
                        (
                            costumPants.length > 1
                                ? (
                                    (costumPants[1] ? "   left: " + costumPants[1] + "px;\n" : "") +
                                    (costumPants[2] ? "   top: " + costumPants[2] + "px;\n" : "")
                                )
                                : ""
                        ) +
                        "}\n"
                    ) : ""
                )
                ;
            }

            // write file
            fsExt.writeFileSync(pathDest, css);
        },
        generateMapColors: () => {
            const catsJSON = require("../../database/trackdata/categories.json"),
                mapTierJSON = require("../../database/map.json"),
                pathDest = `${pathForSprites}map-colors.less`;
            let css = firstFileRow;

            Object.keys(catsJSON.all).forEach(function (catId) {
                var cat = catsJSON.all[catId];
                css += "." + cat.class + "{color:#" + cat.color + "}";
                css += "." + cat.class + "-bg{background-color:#" + cat.color + "}\n";
            });

            mapTierJSON.tiers.forEach(function (tier) {
                css += "." + tier.class + "{color:#" + tier.color + "}";
                css += "." + tier.class + "-bg{background-color:#" + tier.color + "}\n";
            });

            // write file
            fsExt.writeFileSync(pathDest, css);
        }
    };
};