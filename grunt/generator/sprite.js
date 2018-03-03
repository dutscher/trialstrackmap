module.exports = function () {
    var _ = require("lodash");

    function replaceHoster (hoster, path) {
        if (!hoster || !path || path.indexOf("http") >= 0)
            return path;

        Object.keys(hoster).forEach(function (_index_) {
            path = path.replace(_index_, hoster[_index_]);
        });

        return path;
    }

    function jsMixinPlainCSS_ (name, css_) {
        var obj = {},
            css = ".this-line-will-be-removed{};\n";
        css += ".jsMixinPlainCSS_" + name + "(){\n";
        css += css_;
        css += " }\n";

        obj[name] = css;

        return obj;
    }

    return {
        generateSprites: function () {
            return _.extend({},
                this.generatePaintjobs(),
                jsMixinPlainCSS_("costums", this.generateCostums()),
                jsMixinPlainCSS_("mapColors", this.generateMapColors()),
                jsMixinPlainCSS_("i18nIcons", this.generateI18NIcons())
            );
        },
        generatePaintjobs: function () {
            require("json5/lib/require");
            var globalVars = {},
                bikesJSON = require("../../build/bikes.json").build.bikes,
                gfxJSON = require("../../database/media/gfx.json"),
                imageJson = gfxJSON.images,
                bikes = bikesJSON.bikes,
                //gfx dimensions
                spritePaintJobDimensions = imageJson.paintjobs.dim.split("x"),
                spritePaintJobIconDimensions = imageJson["paintjob-icons"].dim.split("x"),
                //sprite dimensions
                paintJobDimensions = imageJson.paintjobs.dimIcon.split("x"),
                paintJobIconDimensons = imageJson["paintjob-icons"].dimIcon.split("x"),
                //scale dimensions
                spritePaintJobScalePercent = imageJson.paintjobs.scale,
                spritePaintJobIconScalePercent = imageJson["paintjob-icons"].scale;

            function trimName (name) {
                var name = "" + name.toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/\(/g, "")
                    .replace(/\)/g, "");
                return name;
            }

            function calcPercantage (pixel, scalePercent) {
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

            for (var bikeID in bikes) {
                var bikeName = trimName(bikes[bikeID].name),
                    bikeIndex = bikesJSON.spriteSorting.indexOf(parseInt(bikeID));

                for (var paintJob in bikes[bikeID].paintjobs) {
                    var paintJobName = trimName(paintJob),
                        paintJobIndex = Object.keys(bikes[bikeID].paintjobs).indexOf(paintJob);
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
            var wardrobeJSON = require("../../database/media/wardrobe.json"),
                gfxJSON = require("../../database/media/gfx.json"),
                costumOrder = wardrobeJSON.homeshack,
                costumsData = wardrobeJSON.all,
                css = "";

            for (var i = 0; i < costumOrder.length; i++) {
                var costumId = costumOrder[i],
                    costumData = costumsData[costumId],
                    costumName = costumData.name.toLowerCase().replace(/ /g, "-"),
                    costumSelector = "costum--" + costumData.originID,
                    costumParts = costumData.parts,
                    costumHead = costumParts[0].split("|"),
                    costumBody = costumParts[1].split("|"),
                    costumArm = costumParts[2].split("|"),
                    costumPant = costumParts[3].split("|");

                // src|left|top|width
                css += (costumParts ? (
                        "." + costumName + " .costum--head,\n" +
                        "." + costumSelector + " .costum--head,\n" +
                        "." + costumSelector + ".costum--head {\n" +
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
                        "." + costumSelector + " .costum--body,\n" +
                        "." + costumSelector + ".costum--body {\n" +
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
                        "." + costumName + " .costum--arm,\n" +
                        "." + costumSelector + " .costum--arm,\n" +
                        "." + costumSelector + ".costum--arm {\n" +
                        "   background-image: url('" + replaceHoster(gfxJSON.hoster, costumArm[0]) + "');\n" +
                        (
                            costumArm.length > 1
                                ? (
                                    (costumArm[1] ? "   left: " + costumArm[1] + "px;\n" : "") +
                                    (costumArm[2] ? "   top: " + costumArm[2] + "px;\n" : "") +
                                    (costumArm[3] ? "   width: " + costumArm[3] + "px;\n" : "")
                                )
                                : ""
                        ) +
                        "}\n" +
                        "." + costumName + " .costum--pant,\n" +
                        "." + costumSelector + " .costum--pant,\n" +
                        "." + costumSelector + ".costum--pant {\n" +
                        "   background-image: url('" + replaceHoster(gfxJSON.hoster, costumParts[3]) + "');\n" +
                        (
                            costumPant.length > 1
                                ? (
                                    (costumPant[1] ? "   left: " + costumPant[1] + "px;\n" : "")
                                )
                                : ""
                        ) +
                        "}\n"
                    ) : ""
                )
                ;
            }

            return css;
        },
        generateMapColors: function () {
            var catsJSON = require("../../database/categories.json"),
                mapTierJSON = require("../../database/map.json"),
                css = "";

            Object.keys(catsJSON.all).forEach(function (catId) {
                var cat = catsJSON.all[catId];
                css += "." + cat.class + "{color:#" + cat.color + "}";
                css += "." + cat.class + "-bg{background-color:#" + cat.color + "}";
            });

            mapTierJSON.tiers.forEach(function (tier) {
                css += "." + tier.class + "{color:#" + tier.color + "}";
                css += "." + tier.class + "-bg{background-color:#" + tier.color + "}";
            });

            return css;
        },
        generateI18NIcons: function () {
            var gfxJSON = require("../../database/media/gfx.json"),
                css = "";

            Object.keys(gfxJSON.images).forEach(function (iconKey) {
                var icon = gfxJSON.images[iconKey];
                if (iconKey.indexOf("i18n_") === 0) {
                    css += icon.selector + " {\n";
                    css += " background-image: url('" + replaceHoster(gfxJSON.hoster, icon.src) + "');\n";
                    css += " }\n";
                }
            });

            return css;
        }
    };
};