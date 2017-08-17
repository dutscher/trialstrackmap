(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("bikeProperty", function (bikeData, bikeid, property, options) {
            return bikeData[bikeid][property] || "";
        });

        Handlebars.registerHelper("deviceName", function (deviceData, deviceId, options) {
            return (deviceData[deviceId] || "").toLowerCase();
        });
    }
}).call(this);