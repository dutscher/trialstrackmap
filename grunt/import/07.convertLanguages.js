module.exports = function (shared) {
    shared.copyToolTo(shared.toolPath.bin2Txt, shared.i18nPath);

    var scriptAll = "bin2txt.cmd",
        cmds = ["pushd " + shared.makeWinPath(shared.i18nPath)];

    shared.grunt.config("exec.i18nBin2Txt.cmd", cmds.concat(["echo 'convert bin to txt'", scriptAll]).join(" & "));

    shared.grunt.task.run(["exec:i18nBin2Txt"]);
};