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
                function buildBike(paintJobName, paintJobId, bike, bikeId, isLeaked, additionIndex) {
                    var isNew = paintJobName.indexOf("*") !== -1;
                    return `
                    <td class="${pjClassName}">
                        <div class="${pjClassName}__wrap" 
                             garage-big-image="${bike.gfx[isLeaked ? additionIndex + paintJobId : paintJobId]}" 
                             data-title="${bike.name} - ${paintJobName}">
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

                return bikeData.bikeSorting.map((bikeId, index, array) => {
                    const bike = bikeData.bikes[bikeId],
                        paintjobs = bike.paintjobs,
                        nextBikeIndex = index + 1,
                        isNextBike = nextBikeIndex in array,
                        isNextTierBike = isNextBike ? bikeData.bikes[array[nextBikeIndex]].tier !== bike.tier : false,
                        hasLeakedPjs = "pjLeaked" in bike;

                    return `
                <tr class="${isNextTierBike ? "last-tier-bike" : ""}">
                    <td class="${bikeClassName}" data-nums="${paintjobs.length + (hasLeakedPjs ? bike.pjLeaked.length : 0)}">
                        ${bike.name}
                    </td>
                    ${paintjobs.map((paintJobName, paintJobId) => 
                        buildBike(paintJobName, paintJobId, bike, bikeId)).join("")}
                    ${hasLeakedPjs 
                        ? bike.pjLeaked.map((paintJobName, paintJobId) => 
                            buildBike(paintJobName, paintJobId, bike, bikeId, true, paintjobs.length)).join("") 
                        : ""}
                </tr>\n`;
                }).join("");
            });
    };
}).call(this);