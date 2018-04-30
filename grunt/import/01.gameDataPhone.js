module.exports = function (shared) {
    var toDir = shared.makeWinPath(shared.versionPath),
        dirs = {
            files: toDir + "\\files",
            cache: toDir + "\\cache"
        },
        cmds = [
            "echo \"run adb pull\"",
            "echo move to \"" + shared.makeWinPath(shared.toolPath.adb) + "\"",
            "pushd " + shared.makeWinPath(shared.toolPath.adb), // navigate to adb tool
            "adb devices", // test if device is ready
            "adb pull " + shared.androidPath + shared.appPath + " " + shared.versionPath, // pull files

            "echo \"copy dir content to root\" " + toDir + "",
            "xcopy \"" + toDir + "\\" + shared.appPath + "\" \"" + toDir + "\" /s /e /y /i", // copy content to root

            "echo \"remove unused pulled dirs\"",
            "rmdir /S /Q \"" + dirs.files + "\"",
            "rmdir /S /Q \"" + dirs.cache + "\"",
            "rmdir /S /Q \"" + toDir + "\\" + shared.appPath + "\""
        ];

    // TODO:
    /*
    >> pull: sdcard/Android/data/com.ubisoft.redlynx.trialsfrontier.ggp/textures_android.dat -> F:/#trails/#TFunpacker/590/textures_android.dat
    >> 69 files pulled. 0 files skipped.
    >> 3150 KB/s (109542071 bytes in 33.951s)
    "copy dir content to root" F:\#trails\#TFunpacker\590
    >> Datei com.ubisoft.redlynx.trialsfrontier
    >> .ggp nicht gefunden
    0 Datei(en) kopiert
    "remove unused pulled dirs"
    >> Das System kann die angegebene Datei nicht finden.
    >> Exited with code: 2.
    >> Error executing child process: Error: Process exited with code 2.
    Warning: Task "exec:copyContentViaAdb" failed. Use --force to continue.
    */

    shared.grunt.config("exec.copyContentViaAdb.cmd", cmds.join(" & "));
    shared.ensureDirectoryExistence(shared.versionPath + "/adb.jo");
    //console.log(cmds)
    shared.grunt.task.run(["exec:copyContentViaAdb"]);
};