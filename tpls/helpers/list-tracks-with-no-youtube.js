(function() {
    module.exports.register = function(Handlebars) {
        /*

        { types: { '0': '', '1': 'platinum', '2': 'top10' },
     hosts:
      { '1': [Object],
        '2': [Object],
        '3': [Object],
        '4': [Object],
        '5': [Object],
        '6': [Object],
        '7': [Object],
        '8': [Object],
        '9': [Object],
        '10': [Object] },
     videos:
      { '1': '1|hlQDB9oQtuI',
        '2': '1|kxgYCx_8IBk',
        '3': '1|_sHrt7WMr5I',

        * */

        Handlebars.registerHelper('list-tracks-with-no-youtube', function(youtubeData, trackIds) {
            // var args = [];
            // for (var i = 0, len = arguments.length; i <= len; i++) {
            //     var type = typeof ( arguments [i] );
            //     if (type === 'string' || type === 'number') {
            //         args [args.length] = arguments [i];
            //     }
            // }
            //
            // return args.join('');


            console.log(arguments)

        });
    };
}).call(this);