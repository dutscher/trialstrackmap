module.exports = function (shared) {
    function copyAllToOne() {
        // make one content repository
        console.log("Copy all dirs into one");
        shared.ensureDirectoryExistence(shared.newContentPath + "/import.json");
        try {
            // remove unused dir
            if (shared.fs.existsSync(shared.versionPath + "/files")) {
                shared.fs.unlinkSync(shared.versionPath + "/files"); // remove dir
            }
        } catch (e) {
            console.error("couldnt remove imported dir from adb", shared.versionPath + "/files", e.Error);
        }

        var dirData = shared.fs.readdirSync(shared.versionPath);
        for (var i in dirData) {
            var dir = dirData[i];
            if (dir !== shared.allInOneDir
                && shared.fs.lstatSync(shared.versionPath + "/" + dir).isDirectory()) {
                console.log("Copy: " + dir + " to ", shared.newContentPath, "and remove src");
                shared.fsExt.copySync(shared.versionPath + "/" + dir, shared.newContentPath);
                // after extract remove or move
                shared.deleteFolderRecursive(shared.versionPath + "/" + dir); // remove dir
                // remove also .dat file
                var datFile = shared.versionPath + "/" + dir + ".dat";
                shared.fs.unlink(datFile);
                // TODO: unlink .dat files
            }
        }
        console.log("Copied all dirs to one", "'" + shared.newContentPath + "'");
    }

    function copyDbToImport() {
        if (shared.fs.existsSync(shared.confPath)) {
            // copy gamedata import dir
            for (var i in shared.filesOfGame) {
                var fileSrc = shared.confPath + "/" + shared.filesOfGame[i] + shared.defaultExt,
                    fileDest = shared.secretPath + "/" + shared.filesOfGame[i] + shared.defaultExt;
                if (!shared.fs.existsSync(fileDest)) {
                    shared.fsExt.copySync(fileSrc, fileDest);
                    console.log(fileDest + " copied...");
                }
            }
            console.log("Copied all into database import from", "'" + shared.confPath + "'");
        } else {
            console.error("confPath not exists", shared.confPath);
        }
    }

    copyAllToOne();

    copyDbToImport();

    // TODO:
    // (node:4432) [DEP0013] DeprecationWarning: Calling an asynchronous function without callback is deprecated.
};