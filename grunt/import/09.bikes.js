// build/import/game/640/bikes.json5
// database/media/bikes.json
module.exports = function (shared) {
    const dbPath = "database/media/bikes.json";
    const dataDB = require("../../" + dbPath);
    const importPath = `${shared.secretPath}/bikes.json5`;
    const spriteMapPathRaw = `${shared.secretPath}/gen/atlas`;
    const spritesPathRaw = `${shared.secretPath}/MENUZ/WIDGETS`;
    const cansPathRaw = `${shared.secretPath}/MENUZ/ITEM`;
    const resizedPath = `${shared.secretPath}/resized`;
    const bikesPath = `${shared.secretPath}/bikes`;
    const cansPath = `${shared.secretPath}/cans`;
    const hashFile = shared.fs.readFileSync(`${shared.toolPath.hashes}/bike-hashes.txt`, "utf-8");
    const newSizePj = 70;
    const newSizeCan = 50;
    // start import
    const dataImport = require("../../" + importPath);
    const sharp = require("sharp");
    const chunks = require("buffer-chunks");

    shared.grunt.task.run([
        "import-09-bikes-atl",
        "import-09-bikes-copy",
        "import-09-bikes-data",
        "import-09-bikes-prepare-sprite",
        "import-09-bikes-sprite",
        "import-09-bikes-sprite-css",
    ]);

    shared.grunt.registerTask("import-09-bikes-atl", function () {
        const done = this.async();
        let count = 0;
        let left = 0;
        let timeout = null;
        shared.ensureDirectoryExistence(bikesPath + "/fileForDir.jo");
        shared.ensureDirectoryExistence(cansPath + "/fileForDir.jo");

        sharp.queue.on("change", (inQueue) => {
            //console.log("Queue contains " + inQueue + " task(s)");
            left = inQueue;
            // debounce
            if (timeout !== null) {
                clearTimeout(timeout);
                timeout = null;
            }
            timeout = setTimeout(() => {
                console.log("ATL's parsed", left);
                if (left === 0) {
                    done();
                }
            }, 2000);
        });

        function findGhostMeshIndex(index) {
            let result = 0;

            // special for donkey
            if (index === 18) {
                index = 20;
            }

            for (const bikeId in dataImport.BikeData) {
                if (dataImport.BikeData[bikeId].GhostMeshIndex === index) {
                    result = parseInt(bikeId);
                }
            }

            return result;
        }

        function findHashInFile(hash) {
            const lines = hashFile.split("\n");
            const matches = lines.filter(line => line.indexOf(hash) !== -1);
            const data = {
                hash,
                idRaw: 0,
                id: 0,
                pjId: 0,
                can: {
                    id: "00",
                    letter: ""
                },
                debug: {}
            };

            if (matches.length === 1) {
                // 00_bike.png
                // 00_bike_a.png
                const regexp = new RegExp(".*(\\d.)_bike(_([a-z]))?\.png.*", "g");
                const newMatches = regexp.exec(matches[0]);

                const GhostMeshIndex = parseInt(newMatches[1], 10);
                data.debug.hashMatch = matches[0];
                data.debug.GhostMeshIndex = GhostMeshIndex;
                data.id = findGhostMeshIndex(GhostMeshIndex);
                data.idRaw = GhostMeshIndex + 1;
                data.pjId = newMatches[3] ? newMatches[3].charCodeAt(0) - 97 : 0;
                data.can.id = newMatches[1];
                data.can.letter = newMatches[3] ? "_" + newMatches[3].toUpperCase() : "";
            }

            return data;
        }

        function convertHashToId(buffer) {
            // <Buffer 9e a7 21 ec>
            // => 3961628574
            const hash = buffer.readUInt32LE(0);
            return findHashInFile(hash);
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
            };
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
                hashRaw,
                bike: convertHashToId(hashRaw),
                pos,
            };
        }

        function cropBike(coords, spriteIndex) {
            // { bike: { id: 15, pjId: 1, can: { id: '14', letter: '_B' } },
            const cssClass = `${coords.bike.id}-${coords.bike.pjId}`;
            const pos = {left: coords.pos[0], top: coords.pos[1], width: 256, height: 128};
            const spriteRaw = `${spritesPathRaw}/BIKES${spriteIndex >= 1 ? spriteIndex + 1 : ""}.png`;
            const canPathRaw = `${cansPathRaw}/PAINT_${coords.bike.can.id}${coords.bike.can.letter}.png`;
            const pjPath = `${bikesPath}/paintjob-${cssClass}.png`;
            const canPath = `${bikesPath}/paintjob-${cssClass}-icon.png`;

            // crop image from sprite
            if (true || shared.fs.existsSync(spriteRaw) && !shared.fs.existsSync(pjPath)) {
                // paintjob width: 63px; height: 45px;
                sharp(spriteRaw)
                    .extract({
                        left: coords.pos[0],
                        top: coords.pos[1],
                        width: coords.pos[2],
                        height: coords.pos[3]
                    })
                    .toFile(pjPath);
            }

            if (true || shared.fs.existsSync(canPathRaw) && !shared.fs.existsSync(canPath)) {
                // can width: 50px; height: 50px;
                shared.fsExt.copySync(canPathRaw, canPath);
            }
        }

        function readBytes() {
            const renderImages = true;
            const filesMap = [
                "bikes",
                "bikes2",
                "bikes3",
                "bikes4",
            ];

            // find bug in hashes to data
            const cropDebug = () => {
                var sprite = 0;
                var data = {
                    hashRaw: "<Buffer 9b 9b 78 62>",
                    bike:
                        {
                            hash: 1652071323,
                            idRaw: 6,
                            id: 6,
                            pjId: 0,
                            can: {id: "02", letter: ""},
                            debug:
                                {
                                    hashMatch: "../datasource/TrialsMobile/gfx/menuz/widgets/bikes/02_bike.png\t1652071323\r",
                                    GhostMeshIndex: 5
                                }
                        },
                    pos: [512, 140, 256, 128]
                };

                cropBike(data, sprite);
            };
            //cropDebug();

            // read sprite map
            filesMap.map((file, i) => {
                let fileMap = shared.fs.readFileSync(`${spriteMapPathRaw}/${file}.atl`);
                //console.log(getVerCount(fileMap))
                // cut the buffer
                fileMap = fileMap.slice(8, fileMap.length);
                let list = chunks(fileMap, 12);
                //console.log("list.length", list.length)
                // print json
                list.map((l, j) => {
                    let first = JSON.stringify(l);
                    // { bike: { id: 15, pjId: 1, can: { id: '14', letter: '_B' } },
                    if (renderImages) {
                        cropBike(getPos(l), i);
                    } else {
                        console.log("--------");
                        console.log(j, getPos(l), i);
                    }
                });
            });
        }

        readBytes();
    });

    shared.grunt.registerTask("import-09-bikes-copy", () => {
        console.log("copy pjAddons");

        function doCopy(destPath, objPj) {
            for (let pjName in objPj) {
                const pjSrc = objPj[pjName];
                const pjDest = `${destPath}/${pjName}`;
                // from to
                if (shared.fs.existsSync(pjSrc)) {
                    console.log("copySync", pjSrc, "to", pjDest);
                    shared.fsExt.copySync(pjSrc, pjDest);
                } else {
                    console.error(pjSrc, pjDest);
                }
            }
        }

        doCopy(bikesPath, shared.pjAddons.bikes);
        doCopy(bikesPath, shared.pjAddons.cans);
    });

    shared.grunt.registerTask("import-09-bikes-data", () => {
        const file = "database/media/bikes.compare";
        const dataBikes = {
            bikeSorting: [],
            bikes: {}
        };

        dataImport.SkinData.map(skin => {
            if (!(skin.BikeID in dataBikes.bikes)) {
                dataBikes.bikes[skin.BikeID] = {
                    name: dataImport.BikeData[skin.BikeID].Comment,
                    tier: dataImport.BikeData[skin.BikeID].Tier + 1,
                    paintjobs: ["Default"],
                    gfx: []
                };
            }
            // " SkinIndex: " + skin.SkinIndex);
            dataBikes.bikes[skin.BikeID].paintjobs.push(skin.Name);
        });
        console.log("write into", file);
        shared.fs.writeFileSync(file, JSON.stringify(dataBikes, null, 4));
    });

    shared.grunt.registerTask("import-09-bikes-prepare-sprite", function () {
        const done = this.async();
        shared.ensureDirectoryExistence(resizedPath + "/fileForDir.jo");

        let files = [];
        let promises = [];

        shared.fs.readdirSync(bikesPath).forEach(file => {
            files.push(bikesPath + "/" + file);
        });

        //console.log(files);
        console.log("create sprite with ", files.length, "images");

        // do resizing
        files.map((file) => {
            const promise = new Promise((resolve, reject) => {
                const image = sharp(file);
                // pj 63x45
                if (!file.includes("-icon")) {
                    image
                        .metadata()
                        .then(() => {
                            return image
                                .resize(newSizePj).toBuffer();
                        })
                        .then(() => {
                            return image
                                .toFile(file.replace(bikesPath, resizedPath), () => {
                                    resolve();
                                });
                        });
                    // can/icon 50x50
                } else {
                    image
                    // 128x128
                        .extract({
                            left: 13,
                            top: 13,
                            width: 100,
                            height: 100
                        })
                        .resize(newSizeCan)
                        .toFile(file.replace(bikesPath, resizedPath), () => {
                            resolve();
                        });
                }
            });
            promises.push(promise);
        });

        Promise.all(promises).then(() => {
            console.log("sprite prepared well");
            done();
        });
    });

    shared.grunt.registerTask("import-09-bikes-sprite", function () {
        const done = this.async();
        shared.ensureDirectoryExistence(resizedPath + "/fileForDir.jo");
        let files = [];

        // do sprite
        files = [];
        shared.fs.readdirSync(resizedPath).forEach(file => {
            files.push(resizedPath + "/" + file);
        });

        //console.log(files);
        console.log("create sprite with ", files.length, "images");

        const Spritesmith = require("spritesmith");
        Spritesmith
            .run({
                src: files,
                //engine: require("canvassmith")
            }, (err, result) => {
                // If there was an error, throw it
                if (err) {
                    throw err;
                }

                // Output the image
                console.log("write sprite", shared.secretPath + "/sprite-paintjob.png");
                // copy to other repo
                const spriteName = "sprite-paintjob.png";
                const pathToGfxRepo = `../trialstrackmap-gfx/icons/${spriteName}`;
                if (shared.fs.existsSync(pathToGfxRepo)) {
                    shared.fs.writeFileSync(pathToGfxRepo, result.image);
                    console.log(`copied also to ${pathToGfxRepo}`);
                } else {
                    console.error(`can't copy to ${pathToGfxRepo} __filename:${__filename}`);
                }
                // for debug
                shared.fs.writeFileSync(shared.secretPath + "/" + spriteName, result.image);
                shared.fs.writeFileSync(shared.secretPath + "/paintjob-sprite.json", JSON.stringify({
                    newSizePj,
                    newSizeCan,
                    props: result.properties,
                    coords: result.coordinates
                }, null, 2));
                done();
            });

    });

    shared.grunt.registerTask("import-09-bikes-sprite-css", () => {
        const data = require(`../../${shared.secretPath}/paintjob-sprite.json`);

        function trimName(name) {
            const nameLocal = "" + name.toLowerCase()
                .replace(/ /g, "-")
                .replace(/\./g, "")
                .replace(/'/g, "")
                .replace(/\*/g, "")
                .replace(/\(/g, "")
                .replace(/\)/g, "");
            return nameLocal;
        }

        let css = `
            // this file is generated by grunt/import/09.bikes.js
            .paintjob {
              display: inline-block;
              background-repeat: no-repeat;
              width: ${data.newSizePj}px;
              background-size: ${data.props.width}px ${data.props.height}px;
              background-position: 0 0;
              vertical-align: middle;
            }
            
            .paintjob-icon {
              display: inline-block;
              background-repeat: no-repeat;
              width: ${data.newSizeCan}px;
              height: ${data.newSizeCan}px;
              background-size: ${data.props.width}px ${data.props.height}px;
              background-position: 50px 0;
              vertical-align: middle;
            }
        `;

        for (const fileName in data.coords) {
            const tile = data.coords[fileName];
            const pathReplace = fileName
                .split("/")
                .slice(0, -1)
                .join("/") + "/";
            const iconName = fileName
                .replace(pathReplace, "")
                .split(".")
                .slice(0, -1)
                .join(".");
            let iconNameBonxy = "";
            if (iconName.indexOf("-icon") !== -1) {
                iconNameBonxy = "." + iconName
                    .replace("-icon", "")
                    .replace("paintjob-", "paintjob-icon-") + ",";
            }
            // paintjob-12-0-icon.png
            // paintjob-icon-12-0
            // paintjob-8-leaked-0.png
            const iconNameSplit = iconName.split("-");
            // 12
            const bikeId = iconNameSplit[1];
            // 0
            const pjId = iconNameSplit[2];

            if (!dataDB.bikes[bikeId] || !("name" in dataDB.bikes[bikeId])) {
                console.error("add new bike from bikes.json5 to database/media/bikes.json")
            }

            let iconNameHR = iconNameSplit[0] + " " +
                dataDB.bikes[bikeId].name + " ";

            if (pjId === "leaked") {
                const pjIdLeaked = iconNameSplit[3];
                iconNameHR += dataDB.bikes[bikeId].pjLeaked[pjIdLeaked] +
                    (iconNameSplit.length === 5 ? " " + iconNameSplit[4] : "");
            } else {
                iconNameHR += dataDB.bikes[bikeId].paintjobs[pjId] +
                    (iconNameSplit.length === 4 ? " " + iconNameSplit[3] : "");
            }

            //.paintjob-armadillo-default-icon,
            //.test-icon,
            //.paintjob-1-0-icon {
            css += `
                .${trimName(iconNameHR)},
                ${iconNameBonxy}
                .${iconName} {
                    height: ${tile.height}px;
                    background-position: -${tile.x}px -${tile.y}px;
                }
            `;
        }

        console.log("write sprite css");
        shared.fs.writeFileSync(`css/sprites/paintjobs.less`, css);
    });
};