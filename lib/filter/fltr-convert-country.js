angular.module("trialsTrackmap")
    .filter("convertCountry", function () {
        return function (countryCode) {
            if (!countryCode) {
                return 'Unknown';
            }

            var countries = {
                de: "Germany",
                en: "England",
                sk: "Slovakia",
                se: "Sweden",
                id: "India",
                kp: "Korea",
                it: "Italia",
                br: "Brasil",
                co: "Colombia",
                ru: "Russia",
                lt: "Lithuania",
                au: "Australia",
                at: "Austria",
                jp: "Japan",
                cz: "Czech Republic",
                cn: "China",
                ca: "Canada",
                eg: "Egypt",
                es: "Spain",
                et: "Ethiopia",
                ee: "Estonia",
                fr: "France",
                gr: "Greece",
                hr: "Croatia",
                hu: "Hungary",
                mx: "Mexico",
                us: "USA",
                nl: "Netherlands",
                no: "Norway",
                pl: "Poland",
                pt: "Portugal",
                ro: "Romania",
                ua: "Ukraine",
                vn: "Vietnam"
            };

            return countries[countryCode];
        }
    })