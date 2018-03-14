angular
.module('module.editables', [])
.factory("editables", [function() {
	
	var editables = {};
	editables.types = {}; // constructors for useful subtypes

	
	
	editables.base = function(seed, mandatory, readonly) { 
		return {
			type: 		'editable',
			value: 		angular.isObject(seed) ? seed : {value: seed},
			mandatory: 	angular.isUndefined(mandatory) ? true : mandatory,
			readonly: 	angular.isUndefined(readonly) ? false : readonly,
			check: 		function() {return (this.mandatory && (angular.isUndefined(this.value.value) || (this.value.value === ''))) ? 'This  field is mandatory' : false},
			set:		function(value) {this.value.value = value},
			get:		function(){return this.value.value},
			compare:	function(that){return 0},
			watch:		function(observer){this.observer = observer; return this},
			observer:	false
		}
	}

	editables.types.Author = function(first, second) {return {'firstname': first, 'lastname': second}};
	
	editables.authorlist = function(seed, format) {
		var obj = editables.base();
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
			var a = (typeof this.value[0] !== "undefined") ? this.value[0].lastname : '';
			var b = (typeof that.value[0] !== "undefined") ? that.value[0].lastname : '';
			
			return (a.localeCompare(b));
		}
		
		
		obj.setAuthors(seed, format)
		
		return obj;
	}


	/**
	 * page editable
	 * realpage = startPage - as printed
	 * endpage = endPage - as printed
	 *
	 *
	 * Pagecontext
	 * @param d
	 * @returns {{offset: number, maximum: (number|*)}}
	 * @constructor
	 */
	editables.types.Pagecontext = function(d){
		d = d || {offset:0, maximum: -1};
		return {'offset': d.offset || 0, 'maximum': d.maximum || -1}
	}
	/**
	 *
	 * @returns {{type, value, mandatory, readonly, check, set, get, compare, watch, observer}}
	 */
	editables.page = function(initPage) {
		var obj = editables.base();
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
		}

		obj.resetContext = function(d) {
			obj.context = new editables.types.Pagecontext(d);
		}

		obj.get = function(){
			return {
				startPdf: obj.value.startPdf,
				endPdf: obj.value.endPdf,
				showndesc: obj.desc,
				startPrint: obj.startPrint,
				endPrint: obj.endPrint
			}
		}

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

		}

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
		var obj = editables.base(seed, mandatory);
		obj.type = 'text';
		
		obj.compare = function(second) {
			return (this.value.value.localeCompare(second.value.value));
		}
		
		return obj;
	}


	editables.defaultLocales = ['de_DE', 'en_US', 'fr_FR', 'it_IT', 'es_ES'];

	/**
	 *
	 * @param seed - inital value for the first language
	 * @param mandatory
	 * @param locales - list of available languages- editable will use A COPY of that
	 * @returns {{type, value, mandatory, readonly, check, set, get, compare, watch, observer}}
	 */
	editables.language = function(seed, mandatory, locales) {
		var obj = editables.base(seed, mandatory);
		obj.type = 'language';


		if (angular.isArray(locales) && locales.length >  1) {
			obj.locales = angular.copy(locales);
		} else {
			obj.locales = angular.copy(editables.defaultLocales);
		}

		obj.check =	function() {
			//obj.value.value = obj.value.value.toLowerCase();
			if (this.mandatory && !angular.isUndefined(this.value.value) && (this.value.value === '')) {
				return 'This field is mandatory'
			}
			if (!/^[a-z][a-z]_[A-Z][A-Z]$/g.test(this.value.value))  {
				return 'seems not to be proper language code'
			}

			return false;

		}
		obj.compare = function(second) {
			return (this.value.value.localeCompare(second.value.value));
		}
		return obj;

	}

	/**
	 *
	 * @param seed - inital value for the first language
	 * @param mandatory
	 * @param locales - list of available languages- editable will use A COPY of that
	 * @returns {{type, value, mandatory, readonly, check, set, get, compare, watch, observer}}
	 */
	editables.multilingualtext = function(seed, mandatory, locales) {

		var obj = editables.base('', mandatory);
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
		var obj = editables.base(parseInt(seed), mandatory);
		obj.type = 'number';
		obj.check =	function() {
			if (obj.value.value !== parseInt(obj.value.value) && (this.value.value !== '')) {
				return "Only number allowed";
			}
			if (this.mandatory && !angular.isUndefined(this.value.value) && (this.value.value === '')) {
				return 'This field is mandatory'
			} 
			return false;
		}
		obj.compare = function(second) {
			return (this.value.value > second.value.value)  ? 1 : -1;
		}
		return obj;
	}
	
	editables.checkbox = function(seed, mandatory) {
		var obj = editables.base(seed, mandatory);
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
	
	
	editables.language = function(seed, mandatory) {
		var obj = editables.base(seed, mandatory);
		obj.type = 'language';
		obj.check =	function() {
			//obj.value.value = obj.value.value.toLowerCase();
			if (this.mandatory && !angular.isUndefined(this.value.value) && (this.value.value === '')) {
				return 'This field is mandatory'
			}
			if (!/^[a-z][a-z]_[A-Z][A-Z]$/g.test(this.value.value))  {
				return 'seems not to be proper language code'
			}

			return false;
			
		}
		obj.compare = function(second) {
			return (this.value.value.localeCompare(second.value.value));
		}
		return obj;
		
	}
	
	editables.filelist = function(seed, mandatory) {
		var obj = editables.base(seed, mandatory);
		obj.type = 'filelist';
		obj.check =	function() {return false}
		obj.value = seed || [];
		obj.compare = function(second) {return 0}
		obj.push = function(elem) {
			// @ TODO check if elem is OK value for this
			obj.value.push(elem);
		}
		obj.get = function(){
			return this.value
		}
		return obj;
	}

	editables.listitem = function(list, selected, noneallowed) {
		var obj = editables.base(selected, false, false);
		obj.type = 'listitem';
		obj.noneallowed = (noneallowed === true);
		obj.check =	function() {
			if (!obj.value.value && !obj.noneallowed) {
			    return "This is mandatory!"
            }
			return false;
		}
		obj.select = function(selected) {
			this.value = {value: selected && selected in list ? selected : (obj.noneallowed ? 'none' : Object.keys(list)[0])}
		}
		obj.select(selected);
		obj.compare = function(second) {return 0}
		obj.list = list;
		return obj;
	}
	
	editables.loadedfile = function(list, selected) {
		var obj = editables.listitem(list, selected, false);
		obj.type = 'loadedfile';

		return obj;

	}
	
	return (editables);
}])
