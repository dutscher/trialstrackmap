(function () {
    module.exports.register = function (Handlebars) {
        const fs = require("fs");

        Handlebars.registerHelper("hunt-event-stats", (params) => {
            const huntData = params.hash.huntData;
            let tracks = 0;
            let locations = 0;

            for (const track in huntData) {
                tracks++;
                locations += huntData[track].length;
            }

            return params.fn({
                tracks,
                locations,
            });
        });

        Handlebars.registerHelper("hunt-event-sorter", (params) => {
            let trackIds = Object.keys(params.hash.tracksData);
            const i18nData = JSON.parse(fs.readFileSync(params.hash.i18nFile, "utf8"));
            const i18n = i18nData.tracks;
            let letter = "";

            let html = '';
            // sort alphabetical
            trackIds = trackIds.sort((a, b) => {
                return (i18n[a] < i18n[b])
                    ? -1
                    : (i18n[a] > i18n[b])
                    ? 1
                    : 0;
            });

            trackIds.forEach((trackId) => {
                const trackName = i18nData.tracks[trackId];
                const newLetter = trackName.charAt(0);
                let renderLetter = false;
                if(newLetter !== letter) {
                    letter = newLetter;
                    renderLetter = true;
                }
                html += params.fn({
                    renderLetter,
                    letter,
                    trackId,
                    huntData: params.hash.tracksData[trackId],
                    trackName,
                });
            });

            return html;
        });

        Handlebars.registerHelper("hunt-event", (params) => {
            /*
            // The Tanktops
              "97": [
                "https://i.imgur.com/NJsQ6Sd.png", "https://i.imgur.com/bGCelZJ.png", "https://i.imgur.com/4KdGt9b.png", "https://i.imgur.com/w74Xaeg.png"
              ],
            */

            const JSON5 = require('json5');
            const trackID = params.hash.id;
            const trackIdsData = JSON5.parse(fs.readFileSync(params.hash.trackIdsFile, "utf8"));
            const trackName = (params.hash.trackName || "Unknown");
            const locations = params.hash.huntData.length;
            const trackEnv = trackIdsData.filter(track => track.id == trackID).map(track => track.env)[0];
            const images = [];

            params.hash.huntData.forEach((_data_) => {
                const data = _data_.split('|');
                const image = data[0];
                const description = data[1] || '';
                const founder = data[2] || 'dutscher-DE';
                const extension = image.split('.').pop();

                images.push({
                    thumb: image.includes('imgur') ? image.replace('.' + extension, 's.' + extension) : image,
                    image,
                    description,
                    founder,
                });
            });

            return params.fn({
                trackID,
                trackName,
                trackEnv,
                locations,
                images,
            });
        });
    }
}).call(this);