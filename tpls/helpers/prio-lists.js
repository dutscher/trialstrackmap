(function () {
    var fs = require("fs");
    
    module.exports.register = function (Handlebars) {
        Handlebars.registerHelper("prio-listHhomeShack", function (params) {
            var prio = params.hash.data.homeshack,
                data = params.hash.data.all,
                html = "",
                file = params.hash.tpl,
                template = Handlebars.compile(fs.readFileSync(file, "utf8"));
            
            for (var i = 0; i < prio.length; i++) {
                var costumId = prio[i],
                    costumData = data[costumId],
                    costumName = costumData.name.toLowerCase().replace(/ /g, "-"),
                    costumNameHR = costumData.name,
                    costumSelector = "costum--" + costumData.originID;

                html += '\n' +
                    template({
                        selector: costumName + " " + costumSelector,
                        id: costumName,
                        name: costumId + ". " + costumNameHR,
                        season: costumData.season,
                        event: costumData.event,
                        purchase: costumData.purchase,
                        unreleased: costumData.unreleased
                    });
            }
            
            return new Handlebars.SafeString(
                (!params.hash.only_css ? html : "")
            );
        });

        Handlebars.registerHelper("prio-listMcTeams2017", function (params) {
            var prio = params.hash.data.prio[0],
                prioBefore = params.hash.data.prio[1],
                data = params.hash.data.teams,
                devices = params.hash.data.devices,
                html = "",
                file = params.hash.tpl,
                template = Handlebars.compile(fs.readFileSync(file, "utf8"));

            for (var i = 0; i < prio.length; i++) {
                var teamId = prio[i],
                    teamData = data[teamId],
                    rankNow = i + 1,
                    stats = {};

                stats.previousRank = prioBefore.indexOf(teamId) + 1;
                stats.diffRank = stats.previousRank - rankNow;
                stats.diffSign = stats.diffRank > 0 ? "+" : "";
                stats.diffColor = stats.diffRank > 0 ? "green" : stats.diffRank === 0 ? "" : "red";

                html += '\n' +
                    template({
                        rank: rankNow,
                        stats: stats,
                        deviceData: devices,
                        data: teamData
                    });
            }

            return new Handlebars.SafeString(html);
        });
    };
}).call(this);
