(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("add", function (firstVar, additon, options) {
            return firstVar + additon;
        });
    }
}).call(this);