module.exports = function (shared) {
    shared.copyToolTo(shared.toolPath.unpacker, shared.versionPath);

    var scriptAll = "unpacker-mod-all.cmd",
        scriptPng = "unpacker-mod-to-png.cmd",
        cmds = ["pushd " + shared.makeWinPath(shared.versionPath)];

    shared.grunt.config("exec.unpackerAll.cmd", cmds.concat(["echo 'run dat to dir'", scriptAll]).join(" & "));
    shared.grunt.config("exec.unpackerPng.cmd", cmds.concat(["echo 'run pvr to png'", scriptPng]).join(" & "));

    shared.grunt.task.run(["exec:unpackerAll", "exec:unpackerPng"]);
};