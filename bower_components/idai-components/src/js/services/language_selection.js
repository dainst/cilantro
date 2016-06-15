'use strict';

angular.module('idai.components')

/**
 * Given a language, determines by a
 * rule if this language is applicable or if not which
 * other language is applicable in a given context.
 * Once found a suitable language, an operation to
 * apply that language in the clients context gets performed.
 *
 * @author: Daniel M. de Oliveira
 */
.factory('languageSelection', ['language', function(language) {

	var GERMAN_LANG = 'de';
	var ENGLISH_LANG = 'en';

	return {

		/**
		 * The language selection rule.
		 *
		 * @param isLangApplicable - callback function(lang,param) for testing
		 *   if lang is applicable in the clients context
		 * @param applyLang - callback function(lang_,param) for applying
		 *   lang in the clients context
		 * @param param - used as second param for the callbacks
		 */
		__ : function(isLangApplicable,applyLang,param){

			if (language.browserPrimaryLanguage()==GERMAN_LANG){
				applyLang(GERMAN_LANG,param);
				return;
			}

			if (isLangApplicable(language.browserPrimaryLanguage(),param)){
				applyLang(language.browserPrimaryLanguage(),param);
			} else if (language.browserPrimaryLanguage()==ENGLISH_LANG){
				applyLang(GERMAN_LANG,param);
			} else if (isLangApplicable(ENGLISH_LANG,param))
				applyLang(ENGLISH_LANG,param);
			else
				applyLang(GERMAN_LANG,param);
		}
	}
}]);