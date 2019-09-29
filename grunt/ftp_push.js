module.exports = function (grunt) {
    const options = {options: {
        authKey: "distAllInkl",
        host: "trialstrackmap.sb-f.de",
        dest: "/trialstrackmap.sb-f.de/",
        port: 21
    }};

    return {
        danTeamAllInkl: {
            ...options,
            files: [
                {expand: true, cwd: "dist", dest: "dist", src: ["danteam.html"]},
            ]
        },
        bonxy: {
            ...options,
            files: [
                {
                    expand: true,
                    cwd: "dist",
                    dest: "dist",
                    src: [
                        "json/bonxy.json",
                        "json/bonxyResults.json"
                    ],
                },
            ]
        },
        distUpload: {
            ...options,
            files: [
                {
                    expand: true,
                    cwd: ".",
                    src: [
                        "index.html",
                        "css/style-seasons.css"
                    ]
                },
                {expand: true, cwd: "dist", src: "**/*", dest: "dist"}
            ]
        }
    };
};