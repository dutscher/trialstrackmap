(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("bikename", function (bikeid, bikenames, options) {
            return bikenames[bikeid] || "";
        });
    }
}).call(this);