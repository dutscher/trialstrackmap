(function () {
    module.exports.register = function (Handlebars) {
        var fs = require("fs")
            // promisedHandlebars = require("promised-handlebars"),
            // Handlebars = promisedHandlebars(
            //     Handlebars,
            //     {Promise: require("q").Promise}),
            // httpGet = require("get-promise");

        // https://github.com/nknapp/promised-handlebars

        /*
        { types: { '0': '', '1': 'platinum', '2': 'top10' },
     hosts:
      { '1': [Object],
        '2': [Object],
        '10': [Object] },
     videos:
      { '1': '1|hlQDB9oQtuI',
        '2': '1|kxgYCx_8IBk',
        '3': '1|_sHrt7WMr5I',
        */
        Handlebars.registerHelper("list-tracks-with-no-youtube", function (params) {
            var trackIds = params.hash.trackIds,
                youtubeData = params.hash.youtubeData,
                tpl = params.hash.tpl,
                template = Handlebars.compile(fs.readFileSync(tpl, "utf8")),
                i18n = params.hash.i18n,
                i18nData = JSON.parse(fs.readFileSync(i18n, "utf8")),
                html = "";

            trackIds.forEach(function (track) {
                if (!youtubeData.videos[track.id]) {
                    //console.log(track);
                    html += "\n" +
                        template({
                            trackName: i18nData.tracks[track.id],
                            trackId: track.id
                        });
                }
            });

            return new Handlebars.SafeString(html);

            // return httpGet("http://myjson.com/mi2y5")
            //     .get("data")
            //     .then(JSON.parse)
            //     .then(function (data) {
            //         // `options.fn` returns a promise. Wrapping brackets must be added after resolving
            //     });
        });
    };
}).call(this);