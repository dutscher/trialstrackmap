module.exports = {
    dist: {
        files: {
            "dist/seasons.json": [
                "dist/seasons.json"
            ],
            "dist/gfx.json": [
                "dist/gfx.json"
            ],
            "dist/map.json": [
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