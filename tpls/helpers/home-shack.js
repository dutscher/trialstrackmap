(function () {
    module.exports.register = function (Handlebars) {
        Handlebars.registerHelper("homeShack", function (params) {
            var costums = params.hash.data.homeshack,
                costumData = params.hash.data.all,
                content = "",
                style = "";
            
            for (var i = 0; i < costums.length; i++) {
                var costumId = costums[i],
                    costumName = costumData[costumId].name.toLowerCase().replace(/ /g, "-"),
                    costumNameHR = costumData[costumId].name,
                    costumSelector = 'costum--' + costumId,
                    costumParts = costumData[costumId].parts,
                    costumHead = costumParts[0].split("|"),
                    costumBody = costumParts[1].split("|"),
                    costumArm = costumParts[2].split("|");
    
                content += '\n' +
                    '<div class="costum ' + costumName + ' ' + costumSelector + '">\n' +
                    '   <div class="costum__part costum--head"></div>\n' +
                    '   <div class="costum__part costum--body"></div>\n' +
                    '   <div class="costum__part costum--arm"></div>\n' +
                    '   <div class="costum__part costum--pant"></div>\n' +
                    '   <div class="costum__name"><div class="costum__name__inner">' + costumId + '. ' + costumNameHR + '</div></div>\n' +
                    '</div>\n';
                
                // src|left|top|width
                style += (costumParts ? (
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
                    '}\n' ) : '' );
            }
            return content + (style != "" ? '<style>' + style + '</style>\n' : '');
        });
    };
}).call(this);
