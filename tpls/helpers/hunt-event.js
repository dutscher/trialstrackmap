(function () {
    module.exports.register = function (Handlebars) {
        const fs = require("fs");

        function range(start, stop) {
            var result = [];
            for (var idx = start.charCodeAt(0), end = stop.charCodeAt(0); idx <= end; ++idx) {
                result.push(String.fromCharCode(idx));
            }
            return result;
        }

        function pad(num, size) {
            var s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        }

        function convertTime(_time_, showZero) {
            function insertAt(string, inseration, position) {
                return [string.slice(0, position), inseration, string.slice(position)].join("");
            }

            // check and make 22000 -> 022000
            // check and make 2200 -> 002200
            // check and make 220 -> 000220
            // check and make 22 -> 000022
            var time = "" + pad(_time_, 6);

            // insert 022000 -> 0:22000
            time = insertAt(time, ":", 1);
            // insert 0:22000 -> 0:22.000
            time = insertAt(time, ".", 4);
            return time;
        }

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
            const chunksRange = params.hash.chunks.split('-');
            const letterChunks = range(chunksRange[0], chunksRange[1]);
            const medalData = JSON.parse(fs.readFileSync(params.hash.medalFile, "utf8"));
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
                if (newLetter !== letter) {
                    letter = newLetter;
                    renderLetter = true;
                }

                if (letterChunks.includes(letter)) {
                    html += params.fn({
                        renderLetter,
                        letter,
                        medals: medalData[trackId],
                        trackId,
                        huntData: params.hash.tracksData[trackId],
                        trackName,
                    });
                }
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
                trackEnv,
                locations,
                images,
            });
        });

        Handlebars.registerHelper("hunt-event-medals", (medals) => {
            // 3|38500,0|25000,0|22000
            const stringMedals = [];
            const medalsIcon = ['silver', 'gold', 'platinum'].reverse();

            medals.reverse().map((medal, index) => {
                const raw = medal.split('|');

                stringMedals.push(`
                <i class="medal-${medalsIcon[index]}"></i>
                ${convertTime(raw[1])}
                
                <i class="faults"></i>
                ${raw[0]}
`)
            });
            return new Handlebars.SafeString(stringMedals.join('<br />'));
        });
    }
}).call(this);