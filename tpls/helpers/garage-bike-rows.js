(function () {
    module.exports.register = Handlebars => {
        Handlebars.registerHelper("garage-bike-rows",
            (bikeData, bikeClassName, pjClassName) => {
                /*
                <tr>
                    <td class="sprite-table__bike">Armadillo</td>
                    <td class="sprite-table__bike__amount">7</td>
                    <td class="sprite-table__bike__paint-job">
                        <i ...></i>
                    </td>
                    ...
                </tr>
                */

                const showNewestFirst = true;

                function buildBike(paintJobName, paintJobId, bike, bikeId, isLeaked, additionIndex) {
                    var isNew = paintJobName.indexOf("*") !== -1;
                    return `
                    <td class="${pjClassName}">
                        <div class="${pjClassName}__wrap" 
                             garage-big-image="${bike.gfx[isLeaked ? additionIndex + paintJobId : paintJobId]}" 
                             data-title="${bike.name} - ${paintJobName}"
                             data-icon="paintjob-icon paintjob-${bikeId}${isLeaked ? "-leaked" : ""}-${paintJobId}-icon">
                            <span class="${pjClassName}__span">
                                ${isNew ? `<div class="${pjClassName}__new"></div>` : ""}
                                ${isLeaked ? `<div class="${pjClassName}__leaked"></div>` : ""}
                                <i class="paintjob-icon paintjob-${bikeId}${isLeaked ? "-leaked" : ""}-${paintJobId}-icon"></i>
                                <i class="paintjob paintjob-${bikeId}${isLeaked ? "-leaked" : ""}-${paintJobId}"></i>
                            </span>
                            <span class="${pjClassName}__name" 
                                  data-name="${paintJobName.replace("*", "")}"></span>
                        </div>
                    </td>\n`
                }

                let maxPjs = 0;
                Object.values(bikeData.bikes).forEach((bikeData) => {
                    let allPjs = 0;
                    allPjs += bikeData.paintjobs.length;

                    if ("pjLeaked" in bikeData) {
                        allPjs += bikeData.pjLeaked.length;
                    }

                    if(allPjs > maxPjs) {
                        maxPjs = allPjs;
                    }
                });

                return bikeData.bikeSorting.map((bikeId, index, array) => {
                    const bike = bikeData.bikes[bikeId],
                        nextBikeIndex = index + 1,
                        isNextBike = nextBikeIndex in array,
                        isNextTierBike = isNextBike ? bikeData.bikes[array[nextBikeIndex]].tier !== bike.tier : false,
                        hasLeakedPjs = "pjLeaked" in bike;
                    let paintjobs = bike.paintjobs;

                    if (showNewestFirst) {
                        paintjobs = paintjobs.reverse();
                    }

                    const leaked = hasLeakedPjs
                        ? bike.pjLeaked.map((paintJobName, paintJobId) =>
                            buildBike(paintJobName, paintJobId, bike, bikeId, true, paintjobs.length)).join("")
                        : "";

                    return `
                <tr class="${isNextTierBike ? "last-tier-bike" : ""}">
                    <td class="${bikeClassName}" data-nums="${paintjobs.length + (hasLeakedPjs ? bike.pjLeaked.length : 0)}">
                        ${bike.name}
                    </td>
                    ${showNewestFirst ? leaked : ""}
                    ${paintjobs.map((paintJobName, paintJobId) => {
                        if (showNewestFirst) {
                            paintJobId = paintjobs.length - paintJobId - 1;
                        }
                        return buildBike(paintJobName, paintJobId, bike, bikeId);
                    }).join("")}
                    ${!showNewestFirst ? leaked : ""}
                    <td colspan="${maxPjs}"></td>
                </tr>\n`;
                }).join("");
            });
    };
}).call(this);