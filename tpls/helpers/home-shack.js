(function () {
    module.exports.register = function (Handlebars) {
        Handlebars.registerHelper("homeShack", function (params) {
            var customs = params.hash.customs.split(","),
                customData = params.hash.data.all,
                content = "",
                style = "";

            for (var i = 0; i < customs.length; i++) {
                var customId = customs[i],
                    customName = customData[customId].name.toLowerCase().replace(/ /g, "-"),
                    customSelector = 'custom--' + customId,
                    customParts = customData[customId].parts,
                    customHead = customParts[0].split("|"),
                    customBody = customParts[1].split("|"),
                    customArm = customParts[2].split("|");

                content += '\n' +
                    '<div class="custom ' + customName + ' ' + customSelector + '">\n' +
                    '   <div class="custom__part custom--head"></div>\n' +
                    '   <div class="custom__part custom--body"></div>\n' +
                    '   <div class="custom__part custom--arm"></div>\n' +
                    '   <div class="custom__part custom--pant"></div>\n' +
                    '</div>\n';

                style += (customParts ? (
                '.' + customName + ' .custom--head,\n' +
                '.' + customSelector + ' .custom--head {\n' +
                '   background-image: url("' + customHead[0] + '");\n' +
                (
                    customHead.length > 1
                        ? (
                        (customHead[1] ? '   top: ' + customHead[1] + 'px;\n' : '') +
                        (customHead[2] ? '   left: ' + customHead[2] + 'px;\n' : '')
                    )
                        : ''
                ) +
                '}\n' +
                '.' + customName + ' .custom--body,\n' +
                '.' + customSelector + ' .custom--body {\n' +
                '   background-image: url("' + customBody[0] + '");\n' +
                (
                    customBody.length > 1
                        ? (
                        (customBody[1] ? '   left: ' + customBody[1] + 'px;\n' : '')
                    )
                        : ''
                ) +
                '}\n' +
                '.' + customName + ' .custom--arm,\n' +
                '.' + customSelector + ' .custom--arm {\n' +
                '   background-image: url("' + customArm[0] + '");\n' +
                (
                    customArm.length > 1
                        ? (
                        (customArm[1] ? '   width: ' + customArm[1] + 'px;\n' : '') +
                        (customArm[2] ? '   left: ' + customArm[2] + 'px;\n' : '') +
                        (customArm[3] ? '   top: ' + customArm[3] + 'px;\n' : '')
                    )
                        : ''
                ) +
                '}\n' +
                '.' + customName + ' .custom--pant,\n' +
                '.' + customSelector + ' .custom--pant {\n' +
                '   background-image: url("' + customParts[3] + '");\n' +
                '}\n' ) : '' );
            }
            return content + (style != "" ? '<style>' + style + '</style>\n' : '');
        });
    };
}).call(this);
