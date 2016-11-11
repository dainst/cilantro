'use strict';

angular.module('idai.components')

/**
 * @return: the users primary browser language.
 * For german languages (de-*) it shortens the language code to "de".
 * For english languages (en-*) it returns the language code to "en".
 *
 * @author: Daniel M. de Oliveira
 */
.factory('language', function(){

	var lang=navigator.languages ?
		navigator.languages[0] :
		(navigator.language || navigator.userLanguage);

	if (typeof lang === 'undefined') {
		lang = 'de';
	} else {

		if (lang.substring(0,2)=='de') lang='de';
		if (lang.substring(0,2)=='en') lang='en';
	}

	return {
		browserPrimaryLanguage : function(){
			return lang;
		}
	}
});