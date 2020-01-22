/*
extra_type: track - extra: 18,
extra_type: doughnut
extra_type: costum - extra: 16,
extra_type: paintjob - sprite_pointer: "bronco-medic",
extra_type: unlimited-fuel
extra_type: part - extra: "spring-1",

database/media/bikes.json
build/import/game/590/pvp_match_rewards.json5

right rewards file in:
https://s3.amazonaws.com/dlcontent_frontier_android/!!!GAMEVERSION!!!/TrialsContentDL.dat

https://lb-rdv-http.ubi.com/TRIAG_AN_LNCH_A/public/pvp_matches/v1/pvp_config
https://lb-rdv-http.ubi.com/TRIAG_AN_LNCH_A/public/pvp_matches/v1/season/47?lang=en
https://lb-rdv-http.ubi.com/TRIAG_IP_BETA_B/public/pvp_matches/v1/season/%1
https://lb-rdv-http.ubi.com/TRIAG_AN_LNCH_A/public/pvp_matches/v1/matches

*/
module.exports = function (shared) {

    shared.grunt.task.run([
        "import-13-read-matches",
    ]);

    shared.grunt.registerTask("import-13-read-matches", function () {
        const done = this.async();
        const useBetaServer = false;
        const importDir = "build/import/matches/";
        shared.ensureDirectoryExistence(importDir + "file.json");
        const date = new Date();
        // 19.04.25 -> YY-MM-DD
        const today = [
            ("00" + date.getYear()).slice(-2),
            ("00" + (date.getMonth() + 1)).slice(-2),
            ("00" + date.getDate()).slice(-2),
        ].join("-");

        function readMatches(callback) {
            const options = shared.getRequestOpts(
                "/TRIAG_AN_LNCH_A/public/pvp_matches/v1/matches"
            );

            const req = shared.https.request(options, function (res) {
                res.on("data", function (data) {
                    const json = JSON.parse(data);
                    shared.fs.writeFileSync(importDir + today + ".json", JSON.stringify(json, null, 2));
                    callback();
                });
            });

            req.on("error", e => {
                console.error(e);
                done();
            });

            req.end();
        }

        shared.getUbisoftTicket(function () {
            readMatches(() => {
                console.log("matches read done")
            })
        });
    });
};