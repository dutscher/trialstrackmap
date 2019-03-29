module.exports = function (grunt) {
    return {
        distRealEmpu: {
            options: {
                authKey: "distRealEmpu",
                host: "81.169.220.139",
                dest: "/trialstrackmap.sb-f.de/dist/",
                port: 21
            },
            files: [
                {expand: true, cwd: "dist", src: ["trackfinder.html"]},
            ]
        },
        danTeamAllInkl: {
            options: {
                authKey: "distAllInkl",
                host: "trialstrackmap.sb-f.de",
                dest: "/trialstrackmap.sb-f.de/dist/",
                port: 21
            },
            files: [
                {expand: true, cwd: "dist", src: ["danteam.html"]},
            ]
        }
    };
};