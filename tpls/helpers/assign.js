(function () {
    module.exports.register = function (Handlebars, options) {
        //Use this with caution! Assign variable from template
        Handlebars.registerHelper('assign', function () {

            var args = [];
            for (var i = 1, len = arguments.length; i <= len; i++) {
                if (typeof ( arguments [i] ) === 'string') {
                    args [args.length] = arguments [i];
                }
            }

            Handlebars.registerHelper(arguments [0], args.join(''));
            return '';
        });

        Handlebars.registerHelper('unassign', function () {
            Handlebars.unregisterHelper(arguments[0]);
            return '';
        });
    }
}).call(this);