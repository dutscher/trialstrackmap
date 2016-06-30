(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("objectLen", function (object) {
            return Object.keys(object || []).length;
        });
    }
}).call(this);