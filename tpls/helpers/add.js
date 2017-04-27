(function() {
  module.exports.register = function(Handlebars) {
    Handlebars.registerHelper('add', function(firstVar, additon) {
      return firstVar + additon;
    });

    Handlebars.registerHelper('combine', function() {
      var args = [];
      for (var i = 0, len = arguments.length; i <= len; i++) {
        var type = typeof ( arguments [i] );
        if (type === 'string' || type === 'number') {
          args [args.length] = arguments [i];
        }
      }

      return args.join('');
    });

  };
}).call(this);