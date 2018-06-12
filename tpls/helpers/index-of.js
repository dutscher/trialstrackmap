(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("indexOf", function (array, element) {
            return array.indexOf(element);
        });

        Handlebars.registerHelper("findRank", function (array, element) {
            return array.findIndex(function (item) {
                return item.name === element;
            });
        });


        Handlebars.registerHelper("listItem", function (from, to, context, options){
            var item = "";
            for (var i = from, j = to; i < j; i++) {
                item = item + options.fn(context[i]);
            }
            return item;
        });
    };
}).call(this);