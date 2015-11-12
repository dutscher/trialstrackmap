(function () {
    module.exports.register = function (Handlebars, options) {
        /**
         * Loop helper.
         *
         * @return easy for-loop width index
         *
         * @param int n  Amount of iterations
         *
         * @example:
         *
         *  {{#times 4}}
         *      {{index}} <markup>
         *  {{/times}}
         */
        Handlebars.registerHelper("times", function (n, block) {
            var content = "";
            for (var i = 0; i < n; ++i)
                content += block.fn({
                    index: i
                });
            return content;
        });

        /**
         * Loop helper.
         *
         * @return advanced for-loop with index
         *
         * @param int from  Start Value
         * @param int to    End Value
         * @param int incr  Increment by
         *
         * @example:
         *
         *  {{#for 5 10 1}}
         *      {{index}} <markup>
         *  {{/for}}
         */
        Handlebars.registerHelper("for", function (from, to, incr, block) {
            var content = "";
            for (var i = from; i <= to; i += incr)
                content += block.fn({
                    index: i
                });
            return content;
        });
    };
}).call(this);
