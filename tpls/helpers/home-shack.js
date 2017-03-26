(function () {
    var fs = require("fs");
    
    module.exports.register = function (Handlebars) {
        Handlebars.registerHelper("homeShack", function (params) {
            var costumOrder = params.hash.data.homeshack,
                costumsData = params.hash.data.all,
                costumHtml = "",
                costumStyle = "",
                file = "tpls/partials/homeshack/costum.hbs",
                template = Handlebars.compile(fs.readFileSync(file, "utf8"));
            
            for (var i = 0; i < costumOrder.length; i++) {
                var costumId = costumOrder[i],
                    costumData = costumsData[costumId],
                    costumName = costumData.name.toLowerCase().replace(/ /g, "-"),
                    costumNameHR = costumData.name,
                    costumSelector = 'costum--' + costumId,
                    costumParts = costumData.parts,
                    costumHead = costumParts[0].split("|"),
                    costumBody = costumParts[1].split("|"),
                    costumArm = costumParts[2].split("|"),
                    costumPant = costumParts[3].split("|");
                
                costumHtml += '\n' +
                    template({
                        selector: costumName + " " + costumSelector,
                        id: costumName,
                        name: costumId + ". " + costumNameHR,
                        season: costumData.season,
                        event: costumData.event,
                        purchase: costumData.purchase,
                        unreleased: costumData.unreleased
                    });
                
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
            
            return new Handlebars.SafeString(
                costumHtml +
                (costumStyle != "" ? '<style>' + costumStyle + '</style>\n' : '')
            );
        });
    };
}).call(this);
