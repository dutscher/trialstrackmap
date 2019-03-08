// build/import/game/640/bikes.json5
// database/media/bikes.json

module.exports = function (shared) {
    const dbPath = "database/media/bikes.json";
    const dataDB = require("../../" + dbPath);
    const importPath = `build/import/game/${shared.gameVersion}/bikes.json5`;
    const hashFile = shared.fs.readFileSync(`${shared.toolPath.hashes}/bike-hashes.txt`, "utf-8");
    // start import
    const dataImport = require("../../" + importPath);
    const dataBikes = {};
    const chunks = require("buffer-chunks");

    /*
    // textureatlas.txt

    01 armadillo default ID: -1
    02 tango default ID: -1
    03 bronco default ID: -1
    04 jackal default ID: -1
    05 armadillo america  ID: 1 SkinIndex: 0
    06 armadillo lava ID: 26 SkinIndex: 1
    07 tango flame ID: 0 SkinIndex: 0
    10 mantis default ID: -1
    08 marauder scales ID: 25 SkinIndex: 1
    11 marauder default ID: -1
    12 riptide snakebite ID: 3 SkinIndex: 0
    09 berserker spirits ID: 29 SkinIndex: 2
    13 berserker default ID: -1
    14 phantom default ID: -1

    |01|05|08|09|
    |02|06|11|13|
    |03|07|12|14|
    |04|10|
    */

    function findHashInFile(hash) {
        var lines = hashFile.split("\n");
        var matches = lines.filter(line => line.indexOf(hash) !== -1);
        var data = {
            id: 0,
            pjId: 0,
            can: {
                id: "00",
                letter: ""
            }
        };

        if (matches.length === 1) {
            // 00_bike.png
            // 00_bike_a.png
            var regexp = new RegExp(".*(\\d.)_bike(_([a-z]))?\.png.*", "g");
            var newMatches = regexp.exec(matches[0]);
            //console.log(matches, newMatches);

            data.id = parseInt(newMatches[1], 10) + 1;
            data.pjId = newMatches[3] ? newMatches[3].charCodeAt(0) - 97 : 0;
            data.can.id = newMatches[1];
            data.can.letter = newMatches[3] ? "_" + newMatches[3].toUpperCase() : "";
        }

        return data;
    }

    function convertHashToId(buffer) {
        // <Buffer 9e a7 21 ec>
        // => 3961628574
        var hash = buffer.readUInt32LE(0);
        var bikeAndPJID = findHashInFile(hash);
        return bikeAndPJID;
    }

    function getVerCount(file) {
        var list = chunks(file, 4);
        var ver = JSON.stringify(list[0]);
        ver = JSON.parse(ver);
        var count = JSON.stringify(list[1]);
        count = JSON.parse(count);
        return {
            ver: ver.data[0],
            count: count.data[0]
        }
    }

    function getPos(file) {
        let list = chunks(file, 8);
        // <Buffer 00 00 00 00 00 01 80 00>
        // [ <Buffer 00 00>, <Buffer 00 00>, <Buffer 00 01>, <Buffer 80 00> ]
        // [ [ 0, 0 ], [ 0, 0 ], [ 0, 1 ], [ 128, 0 ] ]
        // cut the first again into chunks
        let posRaw = chunks(list[0], 2);
        pos = posRaw.map(buffer => buffer.readInt16LE(0));
        // maybe readable data
        // <Buffer 9e a7 21 ec> => [ 158, 167, 33, 236 ]
        let hashRaw = list[1];
        return {
            bike: convertHashToId(hashRaw),
            pos,
        }
    }

    function readBytes() {
        let file = shared.fs.readFileSync("build/import/game/680/MENUZ/WIDGETS/bikes.atl");
        console.log(getVerCount(file))
        // cut the buffer
        file = file.slice(8, file.length);
        let list = chunks(file, 12);
        console.log("list.length", list.length)

        list.map((l, i) => {
            let first = JSON.stringify(l);
            console.log(i + 1, getPos(l));
        })
    }

    readBytes();
    return;

    dataImport.SkinData.map(skin => {
        if (!(skin.BikeID in dataBikes)) {
            dataBikes[skin.BikeID] = {
                name: dataImport.BikeData[skin.BikeID].Comment,
                tier: dataImport.BikeData[skin.BikeID].Tier + 1,
                paintjobs: ["Default"],
                paintjobsObj: {"00": "Default"}
            }
        }

        dataBikes[skin.BikeID].paintjobs.push(skin.Name + " SkinIndex: " + skin.SkinIndex);
        // dataBikes[skin.BikeID].paintjobsObj[skin.ID] = skin.Name;
    });

    console.log("dataBikes:", dataBikes)
};