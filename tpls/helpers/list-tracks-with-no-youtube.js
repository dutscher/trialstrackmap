(function () {
    module.exports.register = function (Handlebars) {
        var fs = require("fs");
        // promisedHandlebars = require("promised-handlebars")
        // Handlebars = promisedHandlebars(
        //     Handlebars,
        //     {Promise: require("q").Promise}),
        // httpGet = require("get-promise");

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

        Handlebars.registerHelper("list-tracks-with-no-youtube", (params) => {
            const trackIds = params.hash.trackIds;
            const youtubeData = params.hash.youtubeData;
            const tpl = params.hash.tpl;
            const template = Handlebars.compile(fs.readFileSync(tpl, "utf8"));
            const i18n = params.hash.i18n;
            const i18nData = JSON.parse(fs.readFileSync(i18n, "utf8"));
            let html = "";

            function genTracks() {
                // `options.fn` returns a promise. Wrapping brackets must be added after resolving
                trackIds.forEach(function (track) {
                    const videoExists = youtubeData.videos[track.id];
                    const isArray = Array.isArray(videoExists);
                    console.log(videoExists, track.id)
                    if (!videoExists
                        || videoExists && !isArray && !videoExists.startsWith("2|")
                        || videoExists && isArray && !videoExists.indexOf("2|")) {
                        //console.log(track);
                        html += "\n" +
                            template({
                                trackName: i18nData.tracks[track.id],
                                trackId: track.id
                            });
                    }
                });

                return new Handlebars.SafeString(html);
            }

            return genTracks();

            // return httpGet("http://myjson.com/mi2y5")
            //     .get("data")
            //     .then(JSON.parse)
            //     .then(function (data) {
            //
            //
            //         return new Handlebars.SafeString(html);
            //     });
        });
    };
}).call(this);