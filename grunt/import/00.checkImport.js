module.exports = function (shared) {
    var cmds = [
        // navigate to adb tool
        "pushd " + shared.makeWinPath(shared.toolPath.adb),
        // destroy old server
        "adb kill-server",
        // test if device is ready
        "adb devices",
        // check if app is installed
        "adb shell pm path " + shared.appPath,
        // get app version
        `adb shell dumpsys package ${shared.appPath} | findstr versionName`,
        // get app version
        //`adb shell dumpsys package com.ubisoft.redlynx.trialsfrontier.ggp`,
    ];

    shared.grunt.config("exec.checkAdb", {
        cmd: cmds.join(" & "),
        stdout: false,
        stderr: false,
        exitCodes: [0, 1, 4294967295],
        callback: function (error, output) {
            var colors = require("colors/safe"),
                lines = output.split("\r\n")
                    .map(function (line) {
                        return shared._.trim(line);
                    })
                    .filter(function (line) {
                        return line !== "";
                    }),
                label = ["bold", "underline"],
                colorThemes = {
                    good: ["green"],
                    doWhat: ["yellow"],
                    bad: ["red"]
                };
            // https://www.npmjs.com/package/colors
            colors.setTheme(shared._.extend({}, colorThemes, function () {
                var labels = {};
                Object.keys(colorThemes).forEach(function (key, index) {
                    labels[key + "Label"] = shared._.concat(colorThemes[key], label);
                });
                return labels;
            }()));
            /*
                [
                    'List of devices attached',
                    '* daemon not running. starting it now on port 5037 *',
                    '* daemon started successfully *' ]
                ...
                    'ZY3224JGK8\tdevice',
                    'package:/data/app/com.ubisoft.redlynx.trialsfrontier.ggp-9E01P0QnxrdaRT4hlDz1LQ==/base.apk' ]
                ...
                    'ZY3224JGK8\toffline' ]
            */
            if(error === null){
                console.log(colors.good(
                    `${colors.goodLabel("IMPORT FOR VERSION:")}
                            ${shared.gameVersion} (package.json:version, check APP INSTALLED)`));
                // device connection
                if (lines[3] && lines[3].indexOf("device") !== -1) {
                    console.log(colors.good(
                        `✓\t${colors.goodLabel("DEVICE CONNECTED")}:
                            ${lines[3]}`));
                } else if (lines[3] && lines[3].indexOf("offline") !== -1) {
                    console.log(colors.doWhat(
                        `!\t${colors.doWhatLabel("DEVICE OFFLINE")}:
                            ${lines[3]}`));
                    console.log(colors.doWhat("Enable your device."));
                } else {
                    console.log(colors.bad(
                        `❌\t${colors.badLabel("NO DEVICE CONNECTED")}:
                            Activate Developer-Options & USB-Debugging in your device settings.
                            Or set your USB use to 'Charge this device'.
                            Or accept auth request of device`));
                }
                // app installed
                if(lines[4] && lines[4].indexOf(shared.appPath) !== -1) {
                    console.log(colors.good(
                        `✓\t${colors.goodLabel("APP INSTALLED")}:
                            ${lines[4]}
                            ${lines[5]}
                            `));
                } else {
                    console.log(colors.bad(
                        `❌\t${colors.badLabel("APP NOT INSTALLED")}:
                            please install Trials Frontier on your device.`));
                }
                // all tools found
                if(shared.hddPath !== "") {
                    console.log(colors.good(
                        `✓\t${colors.goodLabel("TF TOOLS FOUND")}
                            ${shared.hddPath}`));
                } else {
                    console.log(colors.bad(
                        `❌\t${colors.badLabel("TF TOOLS NOT FOUND:")}:
                            unpack the zip under C:\\`));
                }
            } else {
                console.log(error)
            }
        }
    });
    shared.grunt.task.run(["exec:checkAdb"]);
};