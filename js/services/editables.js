angular
.module('module.editables', [])
.factory("editables", ['$log', function($log) {
	
	var editables = {};
	
	editables.types = {
		'author':	function(first, second) {return {'firstname': first, 'lastname': second}},
		'page':		function(nr, desc) {return {'realpage': parseInt(nr), 'pagedesc': desc || nr, 'endpage': '', /*'offset': 0,*/ 'showndesc': desc || nr}}
	}
	
	
	editables.base = function(seed, mandatory, readonly) { 
		return {
			seed: 		seed,
			type: 		'editable',
			value: 		angular.isObject(seed) ? seed : {value: seed},
			mandatory: 	angular.isUndefined(mandatory) ? true : mandatory,
			readonly: 	angular.isUndefined(readonly) ? false : readonly,
			check: 		function() {return (this.mandatory && !angular.isUndefined(this.value.value) && (this.value.value == '')) ? 'This  field is mandatory' : false;}
		}
	}
	
	
	editables.authorlist = function(seed, format) {
		var obj = editables.base();
		obj.type = 'authorlist';
			
		if (!angular.isArray(seed) || seed.length == 0) {
			obj.value = [new editables.types['author']];
		}
		
		obj.addRow = function() {
			obj.value.push(new editables.types['author']);
			$log.log('Add author');
		}
		
		obj.delRow = function(k) {
			obj.value.splice(k,1);
			$log.log('Delete author ' + k);
		}
				
		obj.format = (typeof format === "undefined") ? 0 : format;
		
		obj.formats = [
		    [/(((\S+)\s)*)(\S+)/, 1, 4], // "FirstName SecondName LastName"
		    [/([^,]+),?\s?(.*)/, 2, 1]   // "Lastname, FirstName SecondName" 
		]; 
			
		obj.setAuthors = function(authors, format) {
			obj.value = [];
			authors = (!angular.isArray(authors)) ? [authors] : authors;
			format = (angular.isUndefined(format)) ? 0 : format;
			angular.forEach(authors, function(author) {
				
				//$log.log('author', author);
				
				if (!author) {
					return;
				}
				
				if (typeof author === 'object') {
					obj.value.push(author);
					return;
				}
				
				// create author from string
				var split = author.trim().match(obj.formats[format][0]);
				
				//$log.log('split', split);
				
				if (!split) {
					return;
				} 
				
				obj.value.push(editables.types['author'](split[obj.formats[format][1]], split[obj.formats[format][2]]));
				
			});
		
		}
		
		obj.check = function() {
			
			var error = false;
			
			if (!obj.value || obj.value.length == 0) {
				error  = 'no Author!'
			}
			
			angular.forEach(obj.value, function(author, i) {
				if (!author.lastname) {
					error = ' Author ' + i + ' needs a family Name';
				}
			});
			
			
			return error;
			
		}
		
		obj.setAuthors(seed, format)
		
		return obj;
	}
	
	
	editables.page = function(nr, realpage, context) {
		var obj = editables.base([nr, realpage]);
		obj.type = 'page';
		obj.value = new editables.types['page'](nr, realpage);
		
		obj.context = context || {'offset': 0};
		
		obj.getCutAt = function() {
			var start = parseInt(obj.value.realpage) + parseInt(obj.context.offset);
			var end   = (obj.value.endpage) ? parseInt(obj.value.endpage) + parseInt(obj.context.offset) : start;
			var desc  = (obj.value.endpage) ? start + ' - ' + end : start;
			return {
				start: start,
				end: end,
				desc: desc
			}
		}
		
		obj.updateDesc = function(force) {
			if (this.value.pagedesc == '' || force  === true) {
				this.value.showndesc = parseInt(this.value.realpage);
				this.value.showndesc += parseInt(this.value.endpage) ? ' - ' + parseInt(this.value.endpage) : '';
			} else {
				this.value.showndesc = this.value.pagedesc;
			}
		}
		
		obj.resetDesc = function() {
			obj.updateDesc(true);
			this.value.pagedesc = this.value.showndesc;
		}
		
		obj.check =	function() {
			if (!obj.value.realpage) {
				return "Missing!";
			}
			if (obj.value.realpage &&(obj.value.realpage != parseInt(obj.value.realpage))) {
				return "Number Only!";
			}
			if (obj.value.endpage && (obj.value.endpage != parseInt(obj.value.endpage))) {
				return "Number Only!";
			}
			if (obj.value.endpage && (parseInt(obj.value.endpage) < parseInt(obj.value.realpage))) {
				return "endpage impossible";
			}
			
			
			return false;
		}
		
		return obj;
	}
	
	
	editables.text = function(seed, mandatory) {
		var obj = editables.base(seed, mandatory);
		obj.type = 'text';
		return obj;
	}
	
	editables.number = function(seed, mandatory) {
		var obj = editables.base(parseInt(seed), mandatory);
		obj.type = 'number';
		obj.check =	function() {
			if (obj.value.value != parseInt(obj.value.value)) {
				return "Only number allowed";
			}
			if (this.mandatory && !angular.isUndefined(this.value.value) && (this.value.value == '')) {
				return 'This field is mandatory'
			} 
			return false;
		}
		return obj;
	}
	
	
	return (editables);
}])