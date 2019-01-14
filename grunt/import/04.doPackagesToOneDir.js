// process.on("uncaughtException", function (error) {
//     console.error(error.stack);
// });

module.exports = function (shared) {

    function copyAllToOne() {
        // make one content repository
        console.log("Copy all dirs into one", shared.newContentPath, "and remove src");
        shared.ensureDirectoryExistence(shared.newContentPath + "/import.json");
        try {
            // remove unused dir
            if (shared.fs.existsSync(shared.versionPath + "/files")) {
                shared.fs.unlinkSync(shared.versionPath + "/files"); // remove dir
            }
        } catch (e) {
            console.error("couldn't remove imported dir from adb", shared.versionPath + "/files", e.Error);
        }

        const dirData = shared.fs.readdirSync(shared.versionPath);
        for (const i in dirData) {
            const dir = dirData[i];
            if (dir !== shared.allInOneDir
                && shared.fs.existsSync(shared.versionPath + "/" + dir)
                && shared.fs.lstatSync(shared.versionPath + "/" + dir).isDirectory()) {
                console.log("Copy: " + dir);
                shared.fsExt.copySync(shared.versionPath + "/" + dir, shared.newContentPath);
                // after extract remove or move
                shared.deleteFolderRecursive(shared.versionPath + "/" + dir); // remove dir
                // remove also .dat file
                const datFile = shared.versionPath + "/" + dir + ".dat";
                if(shared.fs.existsSync(datFile)){
                    shared.fs.unlinkSync(datFile);
                }
            }
        }
        console.log("✓ Copied all dirs");
    }

    function copyDbToImport() {
        if (shared.fs.existsSync(shared.confPath)) {
            // copy gamedata import dir
            for (const i in shared.filesOfGame) {
                const fileSrc = shared.confPath + "/" + shared.filesOfGame[i] + shared.defaultExt,
                    fileDest = shared.secretPath + "/" + shared.filesOfGame[i] + shared.defaultExt;

                if (shared.fs.existsSync(fileSrc) && !shared.fs.existsSync(fileDest)) {
                    shared.fsExt.copySync(fileSrc, fileDest);
                    console.log("Copied:", fileDest);
                }
            }
            console.log(`✓ Copied all configs from '${shared.confPath}' to '${shared.secretPath}'`);
        } else {
            console.error("confPath not exists", shared.confPath);
        }
    }

    function copyAssetsToImport() {
        // copy gamedata import dir
        for (const i in shared.assetsOfGame) {
            const fileSrc = shared.newContentPath + shared.assetsOfGame[i].src;
            const fileDestRoot = shared.secretPath + shared.assetsOfGame[i].src;
            // create dest dir
            shared.ensureDirectoryExistence(fileDestRoot + "/file.png");
            // read files
            const dirData = shared.fs.readdirSync(fileSrc);
            let files = 0;
            // iterate all images in src dir
            for (const j in dirData) {
                const file = dirData[j],
                    filePath = fileSrc + "/" + file,
                    fileDest = fileDestRoot + "/" + file;
                // copy files that have the matcher
                if (!shared.fs.existsSync(fileDest)
                    && shared.fs.lstatSync(filePath).isFile()
                    && file.indexOf(shared.assetsOfGame[i].matcher) !== -1) {
                    shared.fsExt.copySync(filePath, fileDest);
                    files++;
                }
            }
            if (files > 0) {
                console.log(`Copied ${files} files to:`, fileDestRoot);
            }
        }
        console.log(`✓ Copied all assets from '${shared.newContentPath}' to '${shared.secretPath}'`);
    }

    copyAllToOne();
    copyDbToImport();
    copyAssetsToImport();
};