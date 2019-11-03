module.exports = function (shared) {
    // rename ori files to json to parse via js
    var detectRepairs = [
            "    \}\r\n    \{",
            "   \}\r\n   \{",
            "\}\r\n\t\{",
            "\t}\r\n\t{\r\n",
            " \]\r\n \"",
            "\],\r\n  },",
            "\],\r\n  }",
        ],
        repairWith = [
            "},\n{\n", // bikes.txt
            "},\n{\n", // bikes.txt
            "},\n{\n", // bikes.txt
            "},\n{\n", // bikes.txt
            "],\n\"", // levels.txt
            "]\n  },", // levelpack.txt
            "]\n  }", // levelpack.txt
        ],
        files = shared.workingFilesOfGame.filter(function(name){return name.indexOf("level_rewards") === -1}),
        fileNameOld,
        fileNameNew,
        fileData = "",
        newData = {};

    shared.ensureDirectoryExistence(shared.secretPath + "/jojo.json");

    // rename files /////////////////
    for (var i in files) {
        fileNameOld = files[i] + shared.defaultExt;
        fileNameNew = files[i] + shared.toExt;
        if (shared.fs.existsSync(fileNameOld)) {
            console.log("rename: ", fileNameOld, "->", fileNameNew);
            shared.fs.renameSync(fileNameOld, fileNameNew);
            // repair files if json mismatch are exists
            fileData = shared.fs.readFileSync(fileNameNew, "utf8");
            var reg, repaired = false;
            for (var j in detectRepairs) {
                reg = new RegExp(detectRepairs[j], "g");
                if (reg.test(fileData)) {
                    repaired = true;
                    fileData = fileData.replace(reg, repairWith[j]);
                }
            }
            // if some match is fixxed write it down
            if (repaired) {
                console.log("repair: ", fileNameNew);
                shared.fs.writeFileSync(fileNameNew, fileData);
            }
        } else {
            console.error("no file exists or already renamed: ", fileNameOld);
        }
    }
    var levelRewardsFile = shared.workingFilesOfGame.filter(function(name){return name.indexOf("level_rewards") !== -1})[0];
    // convert file txt2json ////////
    fileNameOld = levelRewardsFile + shared.defaultExt;
    fileNameNew = levelRewardsFile + shared.toExt;
    if (shared.fs.existsSync(fileNameOld)) {
        fileData = shared.fs.readFileSync(fileNameOld, "utf8");
        // repair newlines
        fileData = fileData.replace(/\r\n/g, "\n");
        fileData = fileData.replace("#OVERRIDE 500", "#\n#\n#OVERRIDE 500");
        fileData = fileData.replace(/#\n#\n#\n/g, "#\n#\n");
        // split into id's
        fileData = fileData.split("#\n#\n");

        // walk through data
        for (var i in fileData) {
            var str = fileData[i].toLowerCase(),
                rewardData = [],
                tmpData = {};

            if (str.indexOf("# ") === -1
                && str.indexOf("override") === -1) {
                rewardData = str.split("\n");
                tmpData.id = rewardData[1];
                tmpData.name = rewardData[0].replace("#", "");
                // rewards
                tmpData.rewards = [];
                tmpData.rewards.push(rewardData[2].replace("i,", "").split(","));
                tmpData.rewards.push(rewardData[3].replace("i,", "").split(","));
                tmpData.rewards.push(rewardData[4].replace("i,", "").split(","));
                tmpData.rewards.push(rewardData[5].replace("i,", "").split(","));
                // create tmpdata
                tmpData.rewardData = {};
                for (var j in tmpData.rewards) {
                    var reward = tmpData.rewards[j];
                    // raise level one plus
                    reward[1] = parseInt(reward[1]) + 1;
                    // create part level
                    if (!tmpData.rewardData.hasOwnProperty(reward[1])) {
                        tmpData.rewardData[reward[1]] = [];
                    }
                    // add part id
                    tmpData.rewardData[reward[1]].push(parseInt(reward[0]));
                }
                // make new data
                newData[tmpData.id] = {
                    name: tmpData.name,
                    rewardStr: JSON.stringify(tmpData.rewardData),
                    xp: rewardData[6].replace("x,", ""),
                    diamonds: rewardData[7].replace("d,", "")
                };
            }
        }
        //fs.renameSync(fileNameOld, fileNameNew);
        shared.fs.writeFileSync(fileNameNew, JSON.stringify(newData, null, 2));
    }
};