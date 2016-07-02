(function () {
    module.exports.register = function (Handlebars, options) {
        //Use this with caution! Assign variable from template
        Handlebars.registerHelper('helperExist', function (helperLookingFor, options) {
            return (helperLookingFor in Handlebars.helpers) ? options.fn(this) : options.inverse(this);
        });

        Handlebars.registerHelper('helperNotExist', function (helperLookingFor, options) {
            return !(helperLookingFor in Handlebars.helpers) ? options.fn(this) : options.inverse(this);
        });
    }
}).call(this);