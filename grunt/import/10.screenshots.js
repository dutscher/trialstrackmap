module.exports = function (shared) {
    const date = new Date();
    // 19.04.25 -> YY-MM-DD
    const today = [
        ("00" + date.getYear()).slice(-2),
        ("00" + (date.getMonth() + 1)).slice(-2),
        ("00" + date.getDate()).slice(-2),
    ].join("-");

    const destPath = `${shared.hddPath}#screenshots/${today}`;
    shared.ensureDirectoryExistence(destPath + "/adb.jo");

    const cmds = shared._.flattenDeep([
        `echo "run adb pull"`,
        `echo move to "${shared.makeWinPath(shared.toolPath.adb)}"`,
        `pushd ${shared.makeWinPath(shared.toolPath.adb)}`, // navigate to adb tool

        // copy all files
        `echo "copy ${shared.androidScreenshots} (screenshots) to ${destPath}"`,
        `adb pull ${shared.androidScreenshots} ${destPath}`,
        // remove screenshots
        //`adb shell`,
        //`rm -r ${shared.androidScreenshots}`,
    ]);

    shared.grunt.config("exec.copyContentViaAdb.cmd", cmds.join(" & "));
    //console.log(cmds)
    shared.grunt.task.run(["exec:copyContentViaAdb"]);
};