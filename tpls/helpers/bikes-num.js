(function () {
    module.exports.register = function (Handlebars) {
        Handlebars.registerHelper("bikes-num", function (bikesArray) {
            var bikeNums,
                bikesArrayKeys = Object.keys(bikesArray);

            bikeNums = bikesArrayKeys.length;

            return bikeNums;
        });
    }
}).call(this);