module.exports = function (grunt) {
    return {
        danTeam: {
            options: {
                authKey: "server",
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