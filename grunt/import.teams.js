module.exports = function (grunt) {
// import data from
// www.bit.ly/midnightchampteams
// https://docs.google.com/spreadsheets/d/1AzHLhHP8i7QAXexPkiKnen_XrBHx9NBCtyl5rJb1mrA/edit#gid=0
    grunt.registerTask("importCSVMidnightChampTeams", function () {
        var fileData = fs.readFileSync("database/import/midnightchamps_2017.csv", "utf8"),
            fieldData = fileData.split("##\r\n"),
            finalData = {devices: ["Android", "iOS"], teams: {}};

        for (var i in fieldData) {
            var fieldsRaw = fieldData[i].split("\r\n"),
                headers = fieldsRaw[0].split(";"),
                fieldsDataRaw = fieldsRaw.splice(1, fieldsRaw.length - 2),
                lastTeamName = "",
                lastMemberIndex = 0;
            // fix csv end
            headers.push("Device");
            // iterate rows
            for (var j in fieldsDataRaw) {
                var fieldsData = fieldsDataRaw[j].split(";");
                for (var k in fieldsData) {
                    var isTeamName = headers[k] !== "Device",
                        value = fieldsData[k];
                    // cache teamName
                    if (isTeamName) {
                        lastTeamName = headers[k];
                    }
                    // create team
                    if (!(lastTeamName in finalData.teams)) {
                        finalData.teams[lastTeamName] = [];
                    }

                    // add team member
                    if (isTeamName) {
                        finalData.teams[lastTeamName].push({
                            name: value,
                            dvce: 0
                        });

                        lastMemberIndex = finalData.teams[lastTeamName].length - 1;
                    } else {
                        finalData.teams[lastTeamName][lastMemberIndex].dvce = finalData.devices.indexOf(value);
                    }
                }
            }
        }

        ensureDirectoryExistence("database/events/midnightchamps_2017.json");
        fs.writeFileSync("database/events/midnightchamps_2017.json", JSON.stringify(finalData));
    });
};