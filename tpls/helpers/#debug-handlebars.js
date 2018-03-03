(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("debug", function () {
            //console.log("Handlebars", Handlebars);
            // https://github.com/assemble/assemble-handlebars-helpers/blob/master/lib/helpers/with.js
            console.log("options", options.data);

        });

        Handlebars.registerHelper("Xwith", function (context, options_) {
            var fn = options_.fn,
                name = arguments;

            console.log("with", name);

            if (context) {
                if (options.data) {
                    console.log("jojo")
                    //var data = createFrame(options.data);
                    //data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
                    //options = {data: data};
                }
                //return fn(context, options);
            } else {
                //return options.inverse(this);
            }
        });
    };
}).call(this);