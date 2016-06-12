(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("season-countdown", function (all_seasons, active_season) {
            var season = all_seasons[active_season],
                htmlReturn = "";

            if (season.active) {
                htmlReturn = season.title + ' <span class="countdown" date-start="' + season.date + '" date-end="' + season.date_end + '"></span>';
            }
            return htmlReturn;

        });
    };
}).call(this);
