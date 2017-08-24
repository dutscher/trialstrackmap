(function () {
    var fs = require("fs");
    
    module.exports.register = function (Handlebars) {
        Handlebars.registerHelper("homeShack", function (params) {
            var prio = params.hash.data.homeshack,
                data = params.hash.data.all,
                html = "",
                file = "tpls/partials/homeshack/costum.hbs",
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

        Handlebars.registerHelper("MCTeams2017", function (params) {
            var prio = params.hash.data.prio,
                data = params.hash.data.teams,
                devices = params.hash.data.devices,
                html = "",
                file = "tpls/partials/events/team.hbs",
                template = Handlebars.compile(fs.readFileSync(file, "utf8"));

            for (var i = 0; i < prio.length; i++) {
                var teamId = prio[i],
                    teamData = data[teamId];

                html += '\n' +
                    template({
                        rank: i + 1,
                        deviceData: devices,
                        data: teamData
                    });
            }

            return new Handlebars.SafeString(html);
        });
    };
}).call(this);
