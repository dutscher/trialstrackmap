// build/import/game/640/bikes.json5
// database/media/bikes.json

module.exports = function (shared) {
    const dbPath = "database/media/bikes.json";
    const dataDB = require("../../" + dbPath);
    const importPath = `build/import/game/${shared.gameVersion}/bikes.json5`;
    // start import
    const dataImport = require("../../" + importPath);
    const dataBikes = {};

    dataImport.SkinData.map(skin => {
        if (!(skin.BikeID in dataBikes)) {
            dataBikes[skin.BikeID] = {
                name: dataImport.BikeData[skin.BikeID].Comment,
                tier: dataImport.BikeData[skin.BikeID].Tier + 1,
                paintjobs: ["Default"],
                paintjobsObj: { "00": "Default" }
            }
        }

        dataBikes[skin.BikeID].paintjobs.push(skin.Name);
        // dataBikes[skin.BikeID].paintjobsObj[skin.ID] = skin.Name;
    });

    console.log("dataBikes:", dataBikes)
};