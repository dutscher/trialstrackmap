(function () {
    module.exports.register = function (Handlebars) {
        Handlebars.registerHelper("bike-stats", function (bikesArray) {
            var bikeNums,
                paintJobNums = 0,
                bikesArrayKeys = Object.keys(bikesArray);

            bikeNums = bikesArrayKeys.length;

            bikesArrayKeys.forEach(function(index){
                paintJobNums += bikesArray[index].paintjobs.length;
            });

            return "Bikes: " + bikeNums + " Paintjobs: " + paintJobNums;
        });
    }
}).call(this);