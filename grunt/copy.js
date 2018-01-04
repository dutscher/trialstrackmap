module.exports = function (grunt) {

    function pad(_n_, width, _z_) {
        var z = _z_ || "0",
            n = _n_ + "";
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
    }

    var backupDateObj = new Date(),
        backupDate = backupDateObj.getFullYear() + "" + pad(backupDateObj.getMonth() + 1, 2) + "" + pad(backupDateObj.getDate(), 2);

    return {
        timesBackup: {
            src: "database/tracks/times.json",
            dest: "backup/times.bak." + backupDate + ".json"
        },
        timesToDatabase: {
            src: "build/times.json",
            dest: "database/times.json"
        },
        i18nToDist: {
            flatten: true,
            expand: true,
            src: "database/i18n/*.json",
            dest: "dist/i18n/"
        },
        rawToDist: {
            files: [
                {
                    flatten: true,
                    expand: true,
                    src: "database/media/gfx.json",
                    dest: "dist/json/"
                },
                {
                    flatten: true,
                    expand: true,
                    src: "database/events/seasons.json",
                    dest: "dist/json/"
                },
                {
                    flatten: true,
                    expand: true,
                    src: "database/media/wardrobe.json",
                    dest: "dist/json/"
                }
            ]
        },
        jsonWithCommentsToDist: {
            files: [
                {
                    flatten: true,
                    expand: true,
                    src: "build/paintjobs.json",
                    dest: "dist/json/"
                }
            ]
        },
        jsonWithCommentsToBuild: {
            files: [
                {
                    flatten: true,
                    expand: true,
                    src: "database/media/paintjobs.json",
                    dest: "build"
                }
            ]
        },
        indexToRoot: {
            files: [
                {
                    flatten: true,
                    expand: true,
                    src: "dist/index.html",
                    dest: "./"
                }
            ]
        }
    }
};