module.exports = function (shared) {
    shared.copyToolTo(shared.toolPath.hashes, shared.i18nPath);

    var scriptAll = "hashtest.cmd",
        cmds = ["pushd " + shared.makeWinPath(shared.i18nPath)];

    shared.grunt.config("exec.i18nHashes.cmd", cmds.concat(["echo 'get hashes'", scriptAll]).join(" & "));

    shared.grunt.task.run(["exec:i18nHashes"]);
};