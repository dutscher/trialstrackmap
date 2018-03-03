(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("bikeProperty", function (bikeData, bikeid, property, options) {
            return bikeData[bikeid][property] || "";
        });

        Handlebars.registerHelper("deviceName", function (deviceData, deviceId, options) {
            return (deviceData[deviceId] || "").toLowerCase();
        });

        Handlebars.registerHelper("replaceHoster", function (path, hoster, options) {
            if (!hoster || !path || path.indexOf("http") >= 0)
                return path;

            Object.keys(hoster).forEach(function (_index_) {
                path = path.replace(_index_, hoster[_index_]);
            });

            return path;
        });
    };
}).call(this);