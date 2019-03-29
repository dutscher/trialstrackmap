(function () {
    module.exports.register = function (Handlebars) {
        Handlebars.registerHelper("bike-paintjobs", function (bikeData) {
            var maxPaintjobs = 0,
                html = "";

            for (var bikeId in bikeData.bikes) {
                var nums = bikeData.bikes[bikeId].paintjobs.length;
                if (nums > maxPaintjobs) {
                    maxPaintjobs = nums;
                }
            }
            // increase for footer
            maxPaintjobs++;

            for (var paintJobId = -1; paintJobId < maxPaintjobs; paintJobId++) {
                html += "<tr>";
                for (var i in bikeData.bikeSorting) {
                    var bikeId = bikeData.bikeSorting[i],
                        paintjobs = bikeData.bikes[bikeId].paintjobs,
                        paintjobName = paintjobs[paintJobId],
                        paintJobExist = paintjobs.indexOf(paintjobName) !== -1,
                        paintjobLength = paintjobs.length;

                    // header
                    if (paintJobId === -1) {
                        html += '<td class="sprite-col-subheader"><div class="sprite-col-subheader-label">' + paintjobLength + '</div></td>'
                    } else {
                        html += '<td class="sprite-col-item' + (!paintJobExist ? " is-empty" : "") + '" title="'
                            + (paintJobExist ? paintjobName : "") + '">';
                        if (paintJobExist) {
                            html += '<i class="paintjob-icon paintjob-' + bikeId + '-' + paintJobId + '-icon"></i>';
                            html += '<i class="paintjob paintjob-' + bikeId + '-' + paintJobId + '"></i>';
                        }
                        html += "</td>\n";
                    }
                }
                html += "</tr>\n";
            }

            return html;
        });
    };
}).call(this);