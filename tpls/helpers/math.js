(function () {
    module.exports.register = function (Handlebars) {
        function math(lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);

            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            }[operator];
        }

        Handlebars.registerHelper("math", math);

        Handlebars.registerHelper("mathWithPad", function (lvalue, operator, rvalue) {
            var int = math(lvalue, operator, rvalue);
            return (int < 10 ? "0" : "") + int;
        });
    }
}).call(this);