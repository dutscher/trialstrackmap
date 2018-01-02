module.exports = {
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