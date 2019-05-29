(function () {
    module.exports.register = Handlebars => {
        Handlebars.registerHelper("garage-tier-cells", (bikeData, tierClassName, bikeClassName) => {
            /*
            <tr>
                        <td rowspan="5" class="sprite-table__tier">
                            1
                        </td>
                        <td class="sprite-table__bike"></td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td rowspan="4">
                            2
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td rowspan="5">
                            3
                        </td>
                    </tr>
                    <tr>
                        <td rowspan="3">
                            Crazy
                        </td>
                    </tr>
                    <tr>
                        <td rowspan="1">
                            Leaked
                        </td>
                    </tr>
            */

            let tiers = {},
                html = "";
            // parse all tier variations
            for (const bikeId in bikeData.bikes) {
                const bike = bikeData.bikes[bikeId],
                    tier = bike.tier;
                if (!(tier in tiers)) {
                    tiers[tier] = [bike];
                } else {
                    tiers[tier].push(bike);
                }
            }
            // build html
            for (const tierId in tiers) {
                const tier = tiers[tierId],
                    tierNums = tier.length,
                    tierLabel = tierId === "256" ? "Crazy" : tierId;
                // remove first element
                tier.shift();

                html += `
                    <tr>
                        <td class="${tierClassName}" rowspan="${tierNums}">
                            ${tierLabel}
                        </td>
                        <td class="${bikeClassName}">&nbsp;</td>
                    </tr>
                    ${tier.map(() => `
                    <tr>
                        <td class="${bikeClassName}">&nbsp;</td>
                    </tr>`).join("")}
                `;
            }

            return html;
        });
    }
}).call(this);