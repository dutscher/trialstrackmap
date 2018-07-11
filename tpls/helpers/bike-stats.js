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

        Handlebars.registerHelper("bike-name", function (bikesArray, bikeId, pjId) {
            var dataOfBike = bikesArray[bikeId];
            return dataOfBike ? dataOfBike.name + " - " + dataOfBike.paintjobs[pjId] : "";
        });
    }
}).call(this);