(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("each-all-paintjobs", function (bikeData, bikesPaintjobs) {
            var options = arguments[arguments.length - 1],
                maxPaintjobs = 0,
                html = "";

            for (var bikeId in bikesPaintjobs.bikes) {
                var nums = bikesPaintjobs.bikes[bikeId].length;
                if (nums > maxPaintjobs) {
                    maxPaintjobs = nums;
                }
            }
            // increase for footer
            maxPaintjobs++;

            for (var paintJobId = 0; paintJobId < maxPaintjobs; paintJobId++) {
                html += "<tr>";
                for (var i in bikesPaintjobs.bikeSorting) {
                    var bikeId = bikesPaintjobs.bikeSorting[i],
                        paintJobExist = paintJobId in bikesPaintjobs.bikes[bikeId],
                        paintjobLength = bikesPaintjobs.bikes[bikeId].length,
                        showFooter = paintjobLength == paintJobId;

                    if (!showFooter) {
                        html += '<td class="sprite-col-item' + (!paintJobExist ? " is-empty" : "") + '" title="' + (paintJobExist ? bikesPaintjobs.bikes[bikeId][paintJobId].name : "") + '">';
                        if (paintJobExist) {
                            html += '<i class="paintjob-icon paintjob-icon-' + bikeId + '-' + paintJobId + '"></i>';
                            html += '<i class="paintjob paintjob-' + bikeId + '-' + paintJobId + '"></i>';
                        }
                        html += "</td>\n";
                    } else {
                        html += '<td class="sprite-col-footer"><div class="sprite-col-footer-label">' + paintjobLength + '</div></td>'
                    }
                }
                html += "</tr>\n";
            }

            return html;
        });
    };
}).call(this);