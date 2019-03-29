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
            globalVars._gfxPaintjobIcons = gfxJSON.images["paintjob-icons"].src.replace("#1/", "");

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
                    isSmall = costumParts.length === 3,
                    costumHead = costumParts[0].split("|"),
                    costumBody = costumParts[1].split("|"),
                    costumArm = !isSmall ? costumParts[2].split("|") : [],
                    costumPant = costumParts[!isSmall ? 3 : 2].split("|");

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
                        "." + costumName + " .costum--pant,\n" +
                        "." + costumSelector + " .costum--pant,\n" +
                        "." + costumSelector + ".costum--pant {\n" +
                        "   background-image: url('" + replaceHoster(gfxJSON.hoster, costumPant[0]) + "');\n" +
                        (
                            costumPant.length > 1
                                ? (
                                    (costumPant[1] ? "   left: " + costumPant[1] + "px;\n" : "") +
                                    (costumPant[2] ? "   top: " + costumPant[2] + "px;\n" : "")
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