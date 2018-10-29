(function () {
    module.exports.register = function (Handlebars, options) {
        //Use this with caution! Assign variable from template
        Handlebars.registerHelper('ifIn', function(elem, list, options) {
            if(list && list.indexOf(elem) > -1) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
    }
}).call(this);