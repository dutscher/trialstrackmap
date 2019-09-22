module.exports = function (grunt) {

    grunt.registerTask('createBonxyJson', function () {
        const i18nFile = require('../database/i18n/en.json');
        const bikesFile = require('../database/media/bikes.json');
        const data = {
            tracks: {},
            bikes: {},
        };

        Object.keys(i18nFile.tracks).map((trackId) => {
            data.tracks[trackId] = i18nFile.tracks[trackId].toLowerCase();
            return true;
        });

        Object.keys(bikesFile.bikes).map((bikeId) => {
            data.bikes[bikeId] = bikesFile.bikes[bikeId].name.toLowerCase();
            return true;
        });

        // write file
        require('fs').writeFileSync('dist/json/bonxy.json', JSON.stringify(data));
    });

    return {
        dist: {
            files: {
                "dist/json/seasons.json": [
                    "dist/json/seasons.json"
                ],
                "dist/json/gfx.json": [
                    "dist/json/gfx.json"
                ],
                "dist/json/map.json": [
                    "build/map.json"
                ]
            }
        },
        distI18n: {
            files: [{
                expand: true,
                cwd: "dist/i18n",
                src: [
                    "*.json"
                ],
                dest: "dist/i18n"
            }]
        }
    };
};