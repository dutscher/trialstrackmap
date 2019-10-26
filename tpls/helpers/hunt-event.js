(function () {
    module.exports.register = function (Handlebars) {
        const fs = require("fs");

        Handlebars.registerHelper("hunt-event-stats", (params, options) => {
            const huntData = params.hash.huntData;
            let tracks = 0;
            let locations = 0;

            for(const track in huntData){
                tracks++;
                locations += huntData[track].length;
            }

            return params.fn({
                tracks,
                locations,
            });
        });

        Handlebars.registerHelper("hunt-event", (params, options) => {
            /*
            // The Tanktops
              "97": [
                "https://i.imgur.com/NJsQ6Sd.png", "https://i.imgur.com/bGCelZJ.png", "https://i.imgur.com/4KdGt9b.png", "https://i.imgur.com/w74Xaeg.png"
              ],
            */

            const huntData = params.hash.huntData;
            const trackID = params.hash.id;
            const i18n = params.hash.i18n;
            const i18nData = JSON.parse(fs.readFileSync(i18n, "utf8"));
            const trackname = (i18nData.tracks[trackID] || "Unknown") + " (" + huntData[trackID].length + ")";
            const images = [];

            huntData[trackID].forEach((_data_) => {
                const data = _data_.split('|');
                const image = data[0];
                const description = data[1] || '';
                const founder = data[2] || 'dutscher-DE';
                const extension = image.split('.').pop();

                images.push({
                    thumb: image.replace('.' + extension, 's.' + extension),
                    image,
                    description,
                    founder,
                });
            });
            return params.fn({
                trackID,
                trackname,
                images,
            });
        });
    }
}).call(this);