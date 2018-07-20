angular
.module('module.editables', [])
.factory("editables", ['language_strings', function(languageStrings) {

    /**
     * refactor plans
     * - use constructors instead of factories
     * - use different files for types
     * - ES6 syntax
     */

    const editables = {};
    editables.types = {}; // constructors for useful subtypes
    
    editables.Base = function(seed, mandatory, readonly) { 
        this.type =	        'editable';
        this.value =        angular.isObject(seed) ? seed : {value: seed};
        this.mandatory =    angular.isUndefined(mandatory) ? true : mandatory;
        this.readonly = 	angular.isUndefined(readonly) ? false : readonly;
        this.check = 		() => 
            (this.mandatory && (angular.isUndefined(this.value.value) || (this.value.value === ''))) 
                ? 'This  field is mandatory' 
                : false;
        this.set =          value => this.value.value = value;
        this.get =		    () => this.value.value;
        this.compare =  	that => this.value.value.localeCompare(that.value.value);
        this.watch =		(observer) => {this.observer = observer; return this};
        this.observer =	    false;
    };

    editables.types.Author = function(first, second) {return {'firstname': first, 'lastname': second}};
    
    editables.authorlist = function(seed, format) {
        var obj = new editables.Base();
        obj.type = 'authorlist';
            
        if (!angular.isArray(seed) || seed.length === 0) {
            obj.value = [new editables.types.Author];
        }
        
        obj.addRow = function() {
            obj.value.push(new editables.types.Author);
            console.log('Add author');
        }
        
        obj.delRow = function(k) {
            obj.value.splice(k,1);
            console.log('Delete author ' + k);
        }
                
        obj.format = (typeof format === "undefined") ? 0 : format;
        
        obj.formats = [
            [/(((\S+)\s)*)(\S+)/, 1, 4], // "FirstName SecondName LastName"
            [/([^,]+),?\s?(.*)/, 2, 1]   // "Lastname, FirstName SecondName" 
        ];

        obj.get = function(){
            return this.value
        }



        obj.setAuthors = function(authors, format) {
            obj.value = [];
            authors = (!angular.isArray(authors)) ? [authors] : authors;
            format = (angular.isUndefined(format)) ? 0 : format;
            angular.forEach(authors, function(author) {
                
                //console.log('author', author);
                
                if (!author) {
                    return;
                }
                
                if (typeof author === 'object') {
                    obj.value.push(author);
                    return;
                }
                
                // create author from string
                var split = author.trim().match(obj.formats[format][0]);
                
                //console.log('split', split);
                
                if (!split) {
                    return;
                } 
                
                obj.value.push(editables.types.Author(split[obj.formats[format][1]], split[obj.formats[format][2]]));
                
            });
        
        }

        obj.set = obj.setAuthors;
        
        obj.check = function() {
            
            var error = false;
            
            if (!obj.value || obj.value.length === 0) {
                error  = 'no Author!'
            }
            
            angular.forEach(obj.value, function(author, i) {
                if (!author.lastname) {
                    error = ' Author ' + i + ' needs a family Name';
                }
            });
            
            
            return error;
            
        }
        
        
        obj.compare = function(that) {
            let a = (typeof this.value[0] !== "undefined") ? this.value[0].lastname : '';
            let b = (typeof that.value[0] !== "undefined") ? that.value[0].lastname : '';
            
            return (a.localeCompare(b));
        }
        
        
        obj.setAuthors(seed, format)
        
        return obj;
    }


    editables.types.Pagecontext = function(d){
        d = d || {offset:0, maximum: -1};
        let context = {'offset': d.offset || 0, 'maximum': d.maximum || -1}
        if (angular.isDefined(d.path)) {
         context.path = d.path;
        }
        return context;
    };
    /**
     * page editable
     * startPrint & endPrint - page numbers as printed
     * startPdf & endPdf - real pdf page numbers
     * showndesc - page numbers as printed in index
     * @returns {{type, value, mandatory, readonly, check, set, get, compare, watch, observer}}
     * @constructor
     */
    editables.page = function(initPage) {
        var obj = new editables.Base();
        obj.type = 'page';
        obj.seed = initPage;
        obj.value = {
            startPdf: '',
            endPdf: '',
            showndesc: '', // manually set page description
        }
        obj.context = new editables.types.Pagecontext();

        Object.defineProperty(obj, 'startPrint', {
            get: function() {
                return parseInt(this.value.startPdf) + parseInt(this.context.offset);
            },
            set: function(y) {
                this.value.startPdf = y - this.context.offset;
            }
        });
        Object.defineProperty(obj, 'endPrint', {
            get: function() {
                return parseInt(this.value.endPdf) + parseInt(this.context.offset);
            },
            set: function(y) {
                this.value.endPdf = y - this.context.offset;
            }
        });

        obj.startPrint = initPage || 1;
        obj.endPrint = initPage || 1;

        var manualDesc = false;

        Object.defineProperty(obj, 'desc', {
            get: function() {
                if (!manualDesc) {
                    obj.resetDesc();
                }
                return this.value.showndesc;
            },
            set: function(w) {
                obj.resetDesc(w)
            }
        });

        obj.resetDesc = function(w) {
            if (typeof w !== "undefined" && w) {
                this.value.showndesc = w;
                manualDesc = true;
            } else {
                this.value.showndesc = parseInt(this.startPrint);
                this.value.showndesc += parseInt(this.endPrint) ? '–' + parseInt(this.endPrint) : '';
                manualDesc = false
            }
        };

        obj.resetContext = function(d) {
            obj.context = new editables.types.Pagecontext(d);
        };

        obj.get = function(){
            return {
                showndesc: obj.desc,
                startPrint: obj.startPrint,
                endPrint: obj.endPrint,
                range: [obj.value.startPdf, obj.value.endPdf]
            }
        };

        obj.getFileData = function() {
            return angular.isDefined(obj.context.path) ? {
                file: obj.context.path,
                range: [obj.value.startPdf, obj.value.endPdf]
            } : [];
        };

        /**
         * takes strings like 10-12
         */
        obj.set = function(seed) {
            obj.seed = seed;
            obj.resetDesc(seed);
            let pages = seed.match(/(\d{1,3})\s?[\-\u2013\u2212]?\s?(\d{1,3})?/);
            if (pages && pages.length > 1) {
                obj.startPrint = Number(pages[1]);
                if (typeof pages[2] !== "undefined") {
                    obj.endPrint = Number(pages[2]);
                }
            }

        };

        obj.check =	function() {

            if (!obj.value.startPdf) {
                return "Start Page Missing!";
            }
            if (obj.value.startPdf && (obj.value.startPdf !== parseInt(obj.value.startPdf))) {
                return "Number Only!";
            }
            if (obj.value.endPdf && (obj.value.endPdf !== parseInt(obj.value.endPdf))) {
                return "Number Only!";
            }
            if (obj.value.endPdf && (parseInt(obj.value.endPdf) < parseInt(obj.value.startPdf))) {
                return "End page is impossible!";
            }

            if (obj.endPdf < 1) {
                return "End page is impossible!"
            }
            if (obj.value.startPdf < 0) {
                return "Start page is impossible!"
            }
            if (obj.context.maximum !== -1 && obj.value.endPdf > obj.context.maximum) {
                return "End Page exceeds maximum"
            }


            return false;
        }

        obj.compare = function(second) {
            return (this.value.startPdf > second.value.startPdf) ? 1 : -1;
        }

        return obj;
    }
    
    
    editables.text = function(seed, mandatory) {
        var obj = new editables.Base(seed, mandatory);
        obj.type = 'text';
        
        obj.compare = function(second) {
            return (this.value.value.localeCompare(second.value.value));
        }
        
        return obj;
    }


    editables.defaultLocales = ['de_DE', 'en_US', 'fr_FR', 'it_IT', 'es_ES'];

    /**
     *
     * @param seed - inital value for the first language. can be an locale code (langauge + country)
     * or an english language string like "English"
     * @param mandatory
     * @param locales - list of available languages
     * @returns {{type, value, mandatory, readonly, check, set, get, compare, watch, observer}}
     */
    editables.language = function(seed, mandatory, locales) {
        const obj = new editables.Base(seed, mandatory);
        obj.type = 'language';

        if (angular.isArray(locales) && locales.length >  1) {
            obj.locales = locales;
        } else {
            obj.locales = angular.copy(editables.defaultLocales);
        }

        obj.set = value => {

            if (angular.isUndefined(value)) value = "";

            if (!/^[a-z][a-z]_[A-Z][A-Z]$/g.test(value))  {
                if (languageStrings.getCode639_1(value)) {
                    // try to work with english language names like "English"
                    const applicableLocales = obj.locales
                        .filter(locale => new RegExp("^" + languageStrings.getCode639_1(value) + "_[A-Z][A-Z]$").test(locale));
                    if (applicableLocales.length) value = applicableLocales[0];
                }
            }

            obj.value.value = value;
        };


        obj.check =	() => {
            if (this.mandatory && !angular.isUndefined(obj.value.value) && (obj.value.value === '')) {
                return 'This field is mandatory';
            }
            if (!this.mandatory && !angular.isUndefined(obj.value.value) && (obj.value.value === '')) {
                return false;
            }
            if (!/^[a-z][a-z]_[A-Z][A-Z]$/g.test(obj.value.value))  {
                console.log("!!" + obj.value.value + "!!");
                return 'seems not to be proper language code';
            }
            return false;
        };

        obj.getLanguageName = (code) => languageStrings.getName(code.split("_")[0]);

        return obj;

    };

    /**
     * UNDER DEVELOPMENT, NOT USED RIGHT NOW
     * @param seed - inital value for the first language
     * @param mandatory
     * @param locales - list of available languages- editable will use A COPY of that
     * @returns {{type, value, mandatory, readonly, check, set, get, compare, watch, observer}}
     */
    editables.multilingualtext = function(seed, mandatory, locales) {

        var obj = new editables.Base('', mandatory);
        obj.type = 'multilingualtext';

        obj.locales = (angular.isArray(locales) && locales.length >  1) ? locales : editables.defaultLocales;

        /**
         * the data as collection:
         * [
         *   {
         *     text:  "bla",
         *     locale: "de_DE"
         *   }, ...#
         * ]
         * @returns {Array}
         */
        obj.value = [];

        obj.addRow = function(text, locale) {
            obj.value.push({
                text: text,
                locale: (typeof locale === "undefined") ? '' : locale
            });
        }

        obj.delRow = function(index) {
            obj.value.splice(index,1);
        }

        obj.set = obj.addRow;

        obj.set(seed);

        obj.get = function() {
            return obj.value;
        }

        obj.getLabel = function() {////
            return obj.value[Object.keys(obj.value)[0]];
        }

        /**
         * there is sometimes a case, where additional locales get added, for example int he case we do not know the locale...
         * that it can be switched
         * @param from
         * @param to
         */
        obj.switchLocale = function(index, to) {
            obj.value[index].locale = to;
            obj.value.map(function(thing, idx) {
                if ((thing.locale === to) && (index !== idx)) {
                    thing.locale = '';
                }
            })
        }

        obj.getRemainingLocales = function() {
            let ul = obj.getUsedLocales();
            return obj.locales.filter(function(x) {
                return ul.indexOf(x) === -1
            })

        }

        obj.getUsedLocales = function() {
            return obj.value
                .map(function(x){return obj.locales.indexOf(x.locale) !== -1 ? x.locale : false})
                .filter(function(x){return x !== false})
        }

        obj.check =	function() {

            if (!obj.value.reduce(function(acc, val) {return acc && (val.text !== '')}, true)) {
                return 'Please fill out all selected languages or remove them'
            }

            if (this.mandatory && !Object.keys(obj.value).length) {
                return 'At least one locale version of this is mandatory'
            }

            // if there is only translation and the locale is not selected it is okay

            if (obj.value.length === 1 && obj.value[0].locale === '') {
                return false;
            }

            // else check if all locales are supported
            let errorLocales = obj.value
                .map(function(x){return ((obj.locales.indexOf(x.locale) === -1) || (x.locale === '')) ? x.locale : false})
                .filter(function(x){return (x !== false)});

            if (errorLocales.length > 0) {
                return 'These locales are not supported by selected journal: ' + errorLocales.join(', ');
            }


            return false;
        }

        // ?
        obj.compare = function(second) {
            return (this.value.value.localeCompare(second.value.value));
        }

        return obj;

    }
    
    editables.number = function(seed, mandatory) {
        let obj = new editables.Base(parseInt(seed), mandatory);
        obj.type = 'number';
        obj.check =	function() {
            if ((obj.value.value.toString() !== parseInt(obj.value.value).toString()) && (this.value.value !== '')) {
                return "Only numbers allowed";
            }
            if (this.mandatory && !angular.isUndefined(this.value.value) && (this.value.value === '')) {
                return 'This field is mandatory'
            } 
            return false;
        }
        obj.get = function() {
            return parseInt(obj.value.value);
        }
        obj.compare = function(second) {
            return (this.value.value > second.value.value)  ? 1 : -1;
        }
        return obj;
    }
    
    editables.checkbox = function(seed, mandatory) {
        var obj = new editables.Base(seed, mandatory);
        obj.type = 'checkbox';
        obj.check =	function() {
            return false;
        }
        obj.compare = function(second) {
            return (this.value.value === second.value.value) ? 0 : 1;
        }
        obj.set = function(value) {
            this.value.value = ([false, 'false', 0, '0', NaN, '', undefined, null].indexOf(value) === -1);
        }
        obj.set(seed);
        return obj;
    }

    
    editables.filelist = function(seed, mandatory) {
        let obj = new editables.Base(seed, mandatory);
        obj.type = 'filelist';
        obj.check =	function() {return false};
        obj.value = seed || [];
        obj.compare = function(second) {return 0};
        obj.push = function(elem) {
            // @ TODO check if elem is OK value for this
            obj.value.push(elem);
        };
        obj.get = function(){
            return this.value
        };
        obj.getFileData = function() {
          return obj.value.map(function(item) {
             return {
                 file: item.file,
                 range: [item.from, item.to]
             }
          });
        };
        return obj;
    };

    editables.listitem = function(list, selected, noneallowed) {
        let obj = new editables.Base(selected, false, false);
        list = list || {};
        obj.list = list;
        obj.type = 'listitem';
        obj.noneallowed = (noneallowed === true);
        obj.select = selected => {
            obj.value = {value: selected && selected in obj.list
                ? selected
                : (obj.noneallowed || !Object.keys(obj.list).length ? 'none' : Object.keys(obj.list)[0])}
        };
        obj.select(selected);
        obj.get = () => obj.value.value;
        return obj;
    };
    
    editables.loadedfile = function(list, selected, noneallowed) {
        noneallowed = noneallowed || false;
        let obj = editables.listitem(list, selected, noneallowed);
        obj.type = 'loadedfile';
        return obj;
    };

    editables.types.Date = function(year, month, day) {return {'day': day, 'month': month, 'year': year}};

    editables.date = function(year, month, day, mandatory) {
        let seed = new editables.types.Date(year, month, day);
        let obj = new editables.Base(seed, mandatory);
        obj.type = 'date';

        function toJsDate(date) {
            let year = parseInt(date.year) || 3000;
            let month = parseInt(date.month) - 1 || 0;
            let day = (date.day && date.month) ? (parseInt(date.day) || 1) : 1;

            return new Date(year, month, day);
        }

        function isValidDate(date) {

            if (!obj.value.year) {
                return "Missing year";
            }

            // check full date
            let jsDate = toJsDate(date);

            if (date.year !== jsDate.getFullYear()) {
                return "Invalid date";
            }
            if (date.month && (date.month !== jsDate.getMonth() + 1)) {
                return "Invalid date";
            }
            if (date.day && (date.day !== jsDate.getDate())) {
                return "Invalid date";
            }
            return false;
        }

        obj.check = function() {
            return isValidDate(obj.value)
        }

        obj.get = function() {
            return [obj.value.year, obj.value.month, obj.value.day].join('-');
        }

        obj.set = function(year, month, day) {
            let today = new Date();
            year = parseInt(year) || today.getFullYear();
            month = parseInt(month) || "";
            day = parseInt(day) || "";
            obj.value = new editables.types.Date(year, month, day);
        }

        obj.compare = function(date1, date2) {
            return toJsDate(date1) < toJsDate(date2);
        }

        obj.set(year, month, day);
        return obj;
    }
    
    return (editables);
}])
