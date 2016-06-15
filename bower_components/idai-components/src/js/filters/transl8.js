'use strict';

/* Services */
angular.module('idai.components')

/**
 * @author: Daniel M. de Oliveira
 */
.filter('transl8', ['transl8',function(transl8){
	
	var filterFunction = function(key) {
        if (typeof key == 'undefined') return undefined;
        var trans;
        try {
            trans = transl8.getTranslation(key);
        } catch (err) {
            var msg = "TRL8 MISSING ('"+key+"')";
            console.log(msg);
            return msg;
        }
		return trans;
	}
	filterFunction.$stateful=true;
	return filterFunction;
}]);