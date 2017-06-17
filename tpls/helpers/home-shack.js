(function () {
    var fs = require("fs");
    
    module.exports.register = function (Handlebars) {
        Handlebars.registerHelper("homeShack", function (params) {
            var costumOrder = params.hash.data.homeshack,
                costumsData = params.hash.data.all,
                costumHtml = "",
                file = "tpls/partials/homeshack/costum.hbs",
                template = Handlebars.compile(fs.readFileSync(file, "utf8"));
            
            for (var i = 0; i < costumOrder.length; i++) {
                var costumId = costumOrder[i],
                    costumData = costumsData[costumId],
                    costumName = costumData.name.toLowerCase().replace(/ /g, "-"),
                    costumNameHR = costumData.name,
                    costumSelector = "costum--" + costumData.originID;
                
                costumHtml += '\n' +
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
                (!params.hash.only_css ? costumHtml : "")
            );
        });
    };
}).call(this);
