module.exports = function (shared) {
    var toDir = shared.makeWinPath(shared.versionPath),
        dirs = {
            files: toDir + "\\files",
            cache: toDir + "\\cache"
        },
        cmds = shared._.flattenDeep([
            `echo "run adb pull"`,
            `echo move to "${shared.makeWinPath(shared.toolPath.adb)}"`,
            `pushd ${shared.makeWinPath(shared.toolPath.adb)}`, // navigate to adb tool

            shared.appFiles.map(file => {
                return [
                    `echo "copy ${file}.dat"`,
                    `adb pull ${shared.androidPath}${shared.appPath}/files/${file}.dat ${shared.versionPath}`
                ];
            }),
        ]);

    shared.grunt.config("exec.copyContentViaAdb.cmd", cmds.join(" & "));
    shared.ensureDirectoryExistence(shared.versionPath + "/adb.jo");
    //console.log(cmds)
    shared.grunt.task.run(["exec:copyContentViaAdb"]);
};