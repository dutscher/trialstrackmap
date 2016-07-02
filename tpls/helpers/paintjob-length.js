(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("paintjob-length", function(allPaintjobs, bikeId) {
            return allPaintjobs[bikeId].length;
        });
    }
}).call(this);