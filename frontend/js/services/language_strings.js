'use strict';

angular

    .module('module.languageStrings', [])

    .factory('languageStrings', [function() {

        const ls = {};

        // http://www.loc.gov/standards/iso639-2/php/code_list.php
        const code639_1 = {
            "ar":	"Arabic",
            "eu":	"Basque",
            "bg":	"Bulgarian",
            "ca":	"Catalan",
            "zh":	"Chinese",
            "hr":	"Croatian",
            "cs":	"Czech",
            "da":	"Danish",
            "nl":	"Dutch",
            "fa":	"Farsi",
            "fi":	"Finnish",
            "fr":	"French",
            "gl":	"Galician",
            "de":	"German",
            "el":	"Greek",
            "en":   "English",
            "id":	"Indonesian",
            "it":	"Italian",
            "ja":	"Japanese",
            "mk":	"Macedonian",
            "ml":	"Malayalam",
            "no":	"Norwegian",
            "pl":	"Polish",
            "pt":	"Portuguese",
            "ro":	"Romanian",
            "ru":	"Russian",
            "sr":	"Serbian",
            "es":	"Spanish",
            "sv":	"Swedish",
            "tr":	"Turkish",
            "uk":	"Ukranian",
            "vi":	"Vietnamese",
            "cy":	"Welsh"
        };

        // https://www.iso.org/publication/PUB500001.html
        const code3166 = {
            "IQ": "Iraq",
            "ES": "Spain",
            "BG": "Bulgaria",
            "CN": "China",
            "TW": "Taiwan",
            "HR": "Croatia",
            "CZ": "Czechia",
            "DK": "Denmark",
            "NL": "Netherlands",
            "IR": "Iran",
            "FI": "Finland",
            "CA": "Canada",
            "FR": "France",
            "DE": "Germany",
            "GR": "Greece",
            "ID": "Indonesia",
            "IT": "Italy",
            "JP": "Japan",
            "MK": "FYROM",
            "IN": "India",
            "NO": "Norway",
            "PL": "Poland",
            "BR": "Brazil",
            "PT": "Portugal",
            "RO": "Romania",
            "RU": "Russia",
            "SR": "Serbia",
            "SE": "Sweden",
            "TR": "Turkey",
            "UA": "Ukraine",
            "VN": "Vietnam",
            "GB": "United Kingdom",
            "US": "United States of America"
        };

        const getPropertyName = (object, value) => (Object.values(object).indexOf(value) > -1)
            ? Object.keys(object)[Object.values(object).indexOf(value)]
            : false;

        ls.getName639_1 = code => code639_1[code];

        ls.getName3166 = code => code3166[code];

        ls.getCode639_1 = name => getPropertyName(code639_1, name);

        ls.getCode3166 = name => getPropertyName(code3166, name);

        ls.getName = code => {
            if (code.match(/^[a-z][a-z]_[A-Z][A-Z]$/)) return ls.getNameOJS(...code.split("_"));
            if (code.match(/^[a-z][a-z]$/)) return ls.getName639_1(code);
            if (code.match(/^[A-Z][A-Z]$/)) return ls.getName3166(code);
            return false;
        };

        // https://pkp.sfu.ca/wiki/index.php?title=Translating_OxS#OJS_Languages

        ls.getCodeOJS = name => ls.getCode639_1(name) + '_' + ls.getCode3166(name);

        ls.getNameOJS = (code639_1, code3166) => (ls.getName639_1(code639_1) && ls.getName639_1(code639_1))
            + (ls.getName3166(code3166) && (' (' + ls.getName3166(code3166) + ")"));

        return ls;
    }
    ]);