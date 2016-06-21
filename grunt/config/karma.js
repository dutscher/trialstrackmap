module.exports = function (config) {

    require("json5/lib/require");
    var _config_ = require("./connect.json5");

    config.set({
        basePath: "./../../",
        frameworks: ["jasmine"],
        singleRun: false,
        background: true,
        browsers: ["PhantomJS"],
        port: _config_.karma,
        plugins: [
            "karma-phantomjs-launcher",
            "karma-coverage",
            "karma-jasmine"
        ],
        reporters: "dots"
    });
};