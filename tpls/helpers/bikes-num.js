(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("bikes-num", function (bikesArray, options) {
            var bikeNums = 0,
                bikesArrayKeys = Object.keys(bikesArray);

            bikeNums = bikesArrayKeys.length;

            return bikeNums;
        });
    }
}).call(this);