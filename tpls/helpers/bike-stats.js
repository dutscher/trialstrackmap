(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("bike-stats", function (bikesArray, options) {
            var bikeNums = 0,
                paintJobNums = 0,
                bikesArrayKeys = Object.keys(bikesArray);

            bikeNums = bikesArrayKeys.length;

            bikesArrayKeys.forEach(function(index){
                paintJobNums += bikesArray[index].length;
            });

            return "Bikes: " + bikeNums + " Paintjobs: " + paintJobNums;
        });
    }
}).call(this);