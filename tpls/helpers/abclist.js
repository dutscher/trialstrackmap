(function () {
    module.exports.register = function (Handlebars, options) {
        Handlebars.registerHelper("alphabeticGlyphList", function(items, block) {
            var content = "";
            var names = [];
            var letters = [];
            for(var i=0, l=items.length; i<l; i++) {
                name = items[i].name;
                if(name == ""){
                    continue;
                }
                var firstLetter = name.substring(0,1);
                var arrayWithFirstLetter = names[firstLetter];
                if(arrayWithFirstLetter == null){
                    names[firstLetter] = [];
                    letters.push(firstLetter);
                }
                //var firstName = name.indexOf(" ") == -1 ? name : name.substring(0,name.indexOf(" "));
                names[firstLetter].push(items[i]);
            }

            for(var i=0; i < letters.length; i++) {
                content += "<figure class=\"glyph-letter\">" + letters[i] + "</figure>";
                for(var k=0; k < names[letters[i]].length; k++){
                    //content += "<div>" + names[letters[i]][k] + "</div>";
                    content += block.fn(names[letters[i]][k]);
                }
            }

            return content + "";
        });
    }
}).call(this);