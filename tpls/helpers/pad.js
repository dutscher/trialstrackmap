(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("pad", function(int, block) {
            return (int < 10 ? "0" : "") + int;
        });
    }
}).call(this);