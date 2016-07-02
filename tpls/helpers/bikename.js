(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("bikeProperty", function (bikeData, bikeid, property, options) {
            return bikeData[bikeid][property] || "";
        });
    }
}).call(this);