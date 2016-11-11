'use strict';

angular.module('idai.components',[]);


'use strict';

angular.module('idai.components')


/** 
 * @author: Daniel M. de Oliveira
 */

.directive('idaiFooter', function() {
return {
	restrict: 'E',
	scope: { mailto: '@', institutions: '=', version: '@' },
	templateUrl: 'partials/directives/idai-footer.html',
	controller: [ '$scope', '$http', 'localizedContent', 
		function($scope,$http, localizedContent) {
			$scope.date = new Date();
			$scope.getFooterLinks = function(contentDir){
				$http.get('info/content.json').success(function(data){
					var footerLinks = localizedContent.getNodeById(data,'footer');
					if (footerLinks==undefined) {console.log('error: no footerLinks found');}
					localizedContent.reduceTitles(footerLinks)	
					$scope.dynamicLinkList=footerLinks.children;
				});				
			}
		}],
	link: function(scope,element,attrs){
		scope.getFooterLinks(attrs.contentDir);
	}
}});
'use strict';

angular.module('idai.components')

/** 
 * @author: Sebastian Cuy
 */

 .directive('idaiForm', function() {
	return {
		restrict: 'E',
        transclude: true,
		scope: {
			submit: '&', doc: '='
		},
		templateUrl: 'partials/directives/idai-form.html',
		link: function(scope, elem, attrs) {

			scope.reset = function() {
				scope.doc = {};
			};

		}
	}
});

'use strict';

angular.module('idai.components')

    /**
     * @author: Jan G. Wieners
     */
    .directive('idaiHeader', function () {
        return {
            restrict: 'E',
            //replace: 'true',
            scope: {
                image: '@',
                description: '@',
                link: '@'
            },
            templateUrl: 'partials/directives/idai-header.html'
        }
    });
'use strict';

/* Directives */
angular.module('idai.components')


/**
 * @author: Daniel M. de Oliveira
 */

.directive('includeReplace', function () {
    return {
       	require: 'ngInclude',
       	restrict: 'A', /* optional */
       	link: function (scope, el, attrs) {
           	el.replaceWith(el.children());
       	}  
	}});
'use strict';

angular.module('idai.components')


/**
 * @author: Daniel M. de Oliveira
 */

.directive('idaiMessage', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/directives/idai-message.html',
        controller: [ '$scope', 'message',
            function($scope,message) {

                $scope.messages = message.getMessages();

                $scope.removeMessage = function(transl8Key){
                    message.removeMessage(transl8Key)
                };

            }]
    }});
'use strict';

/* Directives */
angular.module('idai.components')


/**
 * @author: Daniel de Oliveira
 */

	.directive('idaiNavbar', function() {
		return {
			restrict: 'E',
			scope: {
				userObject: '=',
				loginFunction: '&',
				logoutFunction: '&',
				hideSearchForm: '=',
				hideRegisterButton: '=', // set "true" to hide it
				hideContactButton: '=', // set "true" to hide it
				projectId: '@'
			},
			templateUrl: 'partials/directives/idai-navbar.html',
			controller: [ '$scope', '$http', 'localizedContent', '$location',
				function($scope, $http, localizedContent, $location) {

					$scope.getNavbarLinks = function(contentDir){
						$http.get('info/content.json').success(function(data){
							var navbarLinks = localizedContent.getNodeById(data,'navbar');
							if (navbarLinks==undefined) {console.log('error: no navbarLinks found');}
							localizedContent.reduceTitles(navbarLinks)
							$scope.dynamicLinkList=navbarLinks.children;
						});
					};

					$scope.search = function(fq) {
						if ($scope.q) {
							var url = '/search?q=' + $scope.q;
							if (fq) url += "&fq=" + fq;
							$scope.q = null;
							$location.url(url);
						}
					};

					$scope.toggleNavbar = function() {

							$scope.isCollapsed = true;
							$scope.$on('$routeChangeSuccess', function () {
								$scope.isCollapsed = true;
							});
					};
					
				}],
			link: function(scope,element,attrs){
				scope.getNavbarLinks(attrs.contentDir);
			}
		}});
'use strict';

angular.module('idai.components')

/** 
 * @author: Sebastian Cuy
 */

 .directive('idaiPicker', function() {
	return {
		restrict: 'E',
		scope: {
			searchUri: '@',	resultField: '@', titleField: '@',
			totalField: '@', queryParam: '@', limitParam: '@',
			offsetParam: '@', addParams: '=', selectedItem: '='
		},
		templateUrl: 'partials/directives/idai-picker.html',
		controller: [ '$scope', '$parse', '$uibModal',
			function($scope, $parse, $modal) {

				$scope.openModal = function() {
					var modal = $modal.open({
						templateUrl: "picker_modal.html",
						controller: "PickerModalController",
						bindToController: true,
						size: 'lg',
						scope: $scope
					});
					modal.result.then(function(item) {
						$scope.selectedItem = item;
					});
				};

				$scope.$watch("titleField", function(titleField) {
					if (!titleField) titleField = "title";
					$scope.getTitleField = $parse(titleField);
				});

			}
		]
	}
})

.controller('PickerModalController', [ '$scope', '$http', '$q', '$parse', '$uibModalInstance',
	function($scope, $http, $q, $parse, $modalInstance) {
		
		var canceler;

		$scope.result;
		$scope.total = 0;
		$scope.offset = 0;
		$scope.limit = 10;
		$scope.loading = false;
		$scope.preselect = 0;

		var search = function() {
			if (canceler) canceler.resolve();
			if ($scope.query) {
				$scope.loading = true;
				canceler = $q.defer();
				if (!$scope.queryParam) $scope.queryParam = "q";
				if (!$scope.limitParam) $scope.limitParam = "limit";
				if (!$scope.offsetParam) $scope.offsetParam = "offset";
				var requestUri = $scope.searchUri + "?" + $scope.queryParam + "=" + $scope.query;
				requestUri += "&" + $scope.limitParam + "=" + $scope.limit;
				requestUri += "&" + $scope.offsetParam + "=" + $scope.offset;
				if ($scope.addParams) {
					angular.forEach($scope.addParams, function(value, key) {
						requestUri += "&" + key + "=" + value;
					});
				}
				$http.get(requestUri, { timeout: canceler.promise }).then(function(response) {
					if (!$scope.resultField) $scope.resultField = "result";
					var getResultField = $parse($scope.resultField);
					if ($scope.offset == 0) {
						$scope.result = getResultField(response.data);
					} else {
						$scope.result = $scope.result.concat(getResultField(response.data));
					}
					if (!$scope.totalField) $scope.totalField = "total";
					var getTotalField = $parse($scope.totalField);
					$scope.total = getTotalField(response.data);
					$scope.loading = false;
				});
			} else {
				$scope.result = [];
				$scope.total = 0;
			}
		};

		$scope.more = function() {
			$scope.offset += $scope.limit;
			search();
		};

		$scope.keydown = function($event) {
			// arrow down preselects next item
			if ($event.keyCode == 40 && $scope.preselect < $scope.result.length - 1) {
				$scope.preselect++;
			// arrow up select precious item
			} else if ($event.keyCode == 38 && $scope.preselect > 0) {
				$scope.preselect--;
			}
		};

		$scope.keypress = function($event) {
			// enter selects preselected item (if query has not changed)
			if ($event.keyCode == 13) {
				if ($scope.total > 0 && $scope.query == $scope.lastQuery) {
					$event.stopPropagation();
					$scope.selectItem($scope.result[$scope.preselect]);
				} else {
					$scope.newQuery();
				}
			}
		};

		$scope.newQuery = function() {
			$scope.lastQuery = $scope.query;
			$scope.offset = 0;
			search();
		};

		$scope.open = function(uri) {
			window.open(uri, '_blank');
		};

		$scope.selectItem = function(item) {
			$modalInstance.close(item);
		};

		$scope.$watch("titleField", function(titleField) {
			if (!titleField) titleField = "title";
			$scope.getTitleField = $parse(titleField);
		});

	}
]);

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
'use strict';

angular.module('idai.components')

    /**
     * @author: Jan G. Wieners
     */
    .factory('header', function () {

    });
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
'use strict';

/**
 * Perform localization related tasks on 
 * tree structure exemplified by:
 * 
 * node
 *   id: the_id,
 *   title: ( lang_a : title_lang_a, lang_b : title_lang_b ),
 *   children: [ node, node, node ]
 * 
 * @author: Daniel M. de Oliveira
 */
angular.module('idai.components')

.factory('localizedContent',
	['languageSelection', function(languageSelection) {

	return {

		/**
		 * Walks trough all elements of the tree
		 * and adjusts the titles of nodes to only appear
		 * in one language. 
		 *
		 * The choice is beeing made for each node independently 
		 * of the other nodes via the language selection 
		 * rule, taking into consideration the availability of the 
		 * languages of the node.
		 *
		 * Tree structure before:
		 *
		 * node
		 *   id: the_id,
		 *   title: ( lang_a : title_lang_a, lang_b : title_lang_b ),
		 *   children: [ node, node, node ]
		 *
		 * Tree structure after:
		 *
		 * node
		 *   id: the_id,
		 *   title: title_lang_b,
		 *   children: [ node, node, node ]
		 */
		reduceTitles : function(node){

			var adjustTitleForLang = function(lang,node) {
				if (node.title)
					node.title=node.title[lang];
			}

			var isTitleAvailableForLang = function (lang,node) {
				if (!node.title) return false;
				return node.title[lang];
			}

			var recurseProjectsToAdjustTitle = function(node){

				languageSelection.__(isTitleAvailableForLang,adjustTitleForLang,node);

				if (! node.children) return;
				for (var i=0;i<node.children.length;i++) {
					recurseProjectsToAdjustTitle(node.children[i]);
				}
			}

			recurseProjectsToAdjustTitle(node);
		},

		/**
		 * Walks through all elements of the tree and 
		 * determines which language for a node of 
		 * a given title is applicable. 
		 * 
		 * The choice is beeing made via the language selection 
		 * rule, taking into consideration the availability of the 
		 * languages of the node.
		 *
		 * @param node
		 * @param title
		 */
		determineLanguage : function (node,title) {

			var ret_language = '';

			/**
			 * Searches recursively through an object tree and
			 * determines if there is a node whose title matches
			 * *title* and which has a title for lang.
			 *
			 * Abstract tree structure:
			 * node
			 *   id: the_id,
			 *   title: ( lang_a : title, lang_b : title ),
			 *   children: [ node, node, node ]
			 *
			 * @param lang
			 * @param node the root of the object tree.
			 * @returns true if there is at least one item
			 *   meeting the above mentioned condition. false
			 *   otherwise.
			 */
			var isNodeAvailableForLang = function(lang,node) {
				var recursive = function(node){
					if (node.id==title&&node.title[lang]) return true;
					if (node.children)
						for (var i=0; i< node.children.length;i++)
							if (recursive(node.children[i])) return true;
					return false;
				}
				if (recursive(node)) return true;
				return false;
			}

			var setLang = function(lang) {
				ret_language = lang;
			}

			languageSelection.__ (isNodeAvailableForLang,setLang,node);
			return ret_language;
		},
		
		/**
		 * Walks through the elements of the tree 
		 * until it finds a node of the given id.
		 * 
		 * @return reference to the first node 
		 *   found whose id matches param id. 
		 *   undefined if no node could for the id
		 *   could be found.
		 */
		getNodeById : function (node,id) {
			
			var recurse = function(node,id){
				if (node.id==id) return node;
				if (! node.children) return undefined;
				var foundNode=undefined;
				for (var i=0;i<node.children.length;i++){
					var retval=recurse(node.children[i],id);
					if (retval!=undefined) foundNode=retval;
				}
				return foundNode;
					
			}
			return recurse(node,id);
		}
	};
}]);

'use strict';

/**
 * Message store which holds one or more messages for a
 * for the purpose of being displayed to the user.
 *
 * Messages are automatically removed on location changes,
 * though this default behavior can be overridden. Messages
 * also can be removed selectively.
 *
 * The message access is based on
 * transl8keys, which are also used to automatically
 * retrieve the message texts via transl8.
 *
 * <b>Note</b> that the basic assumption here is that the
 * iDAI transl8 service tool is up and running and the translations have
 * been fetched when calling methods of the message service.
 * The assumption is made because we say that if the transl8 service is
 * down you cannot navigate anyway so you will not try to perform actions
 * that require communication with users, which is the purpose of this service.
 *
 * Another assumption is that a transl8Key used to add a message exists and
 * that the developer is responsible for creating it prior to using it. For this
 * reason exceptions get thrown if unknown transl8Keys are used.
 *
 * @author Sebastian Cuy
 * @author Daniel M. de Oliveira
 */
angular.module('idai.components')

.factory('message', [ '$rootScope', 'transl8', '$sce', function( $rootScope, transl8, $sce ) {

    /**
     * A Map [transl8Key,message].
     */
    var messages = {};

    var clearOnLocationChange = true;

    /**
     * The message data structure.
     * @param transl8Key
     */
    function Message(transl8Key) {
        this.text = transl8.getTranslation(transl8Key);
        this.text = $sce.trustAsHtml(this.text);
        this.level = 'warning';
        this.contactInfo = transl8.getTranslation('components.message.contact')
            .replace('CONTACT', 'arachne@uni-koeln.de');
    }

    function isUnknown(level){
        return (['success', 'info', 'warning', 'danger'].indexOf(level) === -1);
    }

    /**
     * Clears all the actual messages.
     * @private
     */
    function _clear() {
        angular.forEach(messages, function(msg, key) {
            delete messages[key];
        });
    }

    /**
     * Creates a new message and adds it to the actual messages.
     * @param transl8Key
     * @returns {*}
     * @private
     */
    function _create(transl8Key) {
        messages[transl8Key]=  new Message(transl8Key);
        return messages[transl8Key];
    }


    /**
     * Clear actual messages when location changes.
     */
    $rootScope.$on("$locationChangeSuccess", function() {
        if (clearOnLocationChange) _clear();
        clearOnLocationChange= true;
    });

    return {

        /**
         * Allows clients to specify that the messages are not cleared
         * during the next location change, which would be the default behavior
         * of the message service.
         *
         * NOTE that in order for this to work the angular $location.path()
         * has to be used. It will not work with window.location.href because
         * then everything gets reloaded, including the default
         * value for clearOnLocationChange.
         */
        dontClearOnNextLocationChange: function() {
            clearOnLocationChange= false;
        },

        /**
         * Adds a message to the actual messages. By default, an extra line
         * is appended below the message containing a standard contact info text.
         * This info text will not appear if level is success.
         *
         * @param transl8Key an existing transl8 key.
         *   Used to identify the message and retrieve the message text from transl8.
         * @param level (optional) should be set to one of
         *   'success', 'info', 'warning', 'danger', which are terms from bootstrap.
         *   If not set, the messages level will default to 'warning'.
         * @param showContactInfo boolean. If set and set to false the contact info
         *   line will not be created.
         *
         * @throws Error if level if set but does not match one of the allowed values.
         * @throws Error if there exists no translation for transl8Key.
         */
        addMessageForCode: function(transl8Key, level, showContactInfo) {

            var message = _create(transl8Key);

            if (level) {
                if (isUnknown(level))
                    throw new Error("If used, level must be set to an allowed value.");
                message.level = level;
            }

            if (showContactInfo==false||message.level=='success')
                delete message.contactInfo;
        },

        /**
         * Removes an error message from the actual messages.
         *
         * @param transl8Key the identifier of the message to be removed.
         */
        removeMessage: function(transl8Key) {
            delete messages[transl8Key];
        },


        /**
         * Removes all messages.
         */
        clear: function() {
            _clear();
        },

        getMessages: function() {
            return messages;
        }
    }
}]);
'use strict';

/**
 * Provides translations for keys based on the primary browser language of the user.
 * Makes use of the CoDArchLab Transl8 tool.
 *
 * @author: Daniel M. de Oliveira
 */
angular.module('idai.components')
.factory('transl8', ['$http', 'language', 'componentsSettings',
		function($http, language, componentsSettings) {

	var ENGLISH_LANG= 'en';
	var GERMAN_LANG= 'de';

	var translationLang=ENGLISH_LANG;
	var translationsLoaded = false;
	var translations={}; // Map: [transl8_key,translation].


	if (language.browserPrimaryLanguage()==GERMAN_LANG) translationLang=GERMAN_LANG;
	var transl8Url = componentsSettings.transl8Uri.replace('{LANG}',translationLang);

	var promise = $http.jsonp(transl8Url).success(function(data) {
		for(var i = 0; i < data.length; i++) {
			translations[data[i].key] = data[i].value;
		}
		translationsLoaded=true;
	}).
	error(function() {
		alert("ERROR: Could not get translations. Try to reload the page or send a mail to arachne@uni-koeln.de");
	});

	return {

        /**
         * @param key an existing key in transl8 with
         *   translations for all existing language sets.
         * @returns translation text
         * @throws Error if the key does not exist in transl8 or
         *   there is no translation for the given key.
         */
		getTranslation: function(key) {
			if (!translationsLoaded) return '';

			var translation = translations[key];
			if (!translation || 0 === translation.length) {
                throw new Error("No translation found for key '" + key + "'");
            }
			return translation;
		},

		onLoaded: function() {
			return promise;
		}

	}
}]);
(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/directives/idai-footer.html',
    '<div class=row><div class="col-md-12 text-center"><p><a ng-repeat="(key, uri) in institutions" ng-href={{uri}}><img class=logoImage ng-src=img/logo_{{key}}.png></a></p><p>{{\'footer_licensed_under\'|transl8}} <a rel=license href=info/order>Creative Commons</a> | <span ng-repeat="link in dynamicLinkList"><a href=info/{{link.id}}>{{link.title}}</a> |</span> {{\'footer_bugs_to\'|transl8}} <a href=mailto:{{mailto}}>{{mailto}}</a></p><p ng-show=version><small>{{version}}</small></p></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/directives/idai-form.html',
    '<form name=form class=form-horizontal><ng-transclude></ng-transclude><div class=form-group><div class="col-sm-offset-3 col-sm-9"><button ng-click=submit() class="btn btn-primary" ng-class="{ disabled: form.$invalid }">{{ \'form_save\' | transl8 }}</button> <button ng-click=reset() class="btn btn-link">{{ \'form_reset\' | transl8 }}</button></div></div></form>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/directives/idai-header.html',
    '<a ng-href={{link}} id=headerlink><header id=teaser><div id=background style="background-image: url({{image}});"></div><div id=description>{{description}}</div></header></a>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/directives/idai-message.html',
    '<div ng-repeat="(transl8Key,message) in messages" ng-class="\'alert-\' + message.level" class="col-md-10 col-md-offset-1 alert text-center"><div class=alert-message><button class=close ng-click=removeMessage(transl8Key) style=cursor:pointer;>&times;</button> <b ng-bind-html=message.text></b><br><span>{{message.contactInfo}}</span></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/directives/idai-navbar.html',
    '<nav class="navbar navbar-default navbar-fixed-top" role=navigation><div style="padding-left:0px; position:relative"><div class=pull-left><ul class="nav navbar-nav"><li uib-dropdown><a href=# uib-dropdown-toggle><img src=img/kleinergreif.png id=brand-img> <b class=caret></b></a><ul uib-dropdown-menu><li><a href=http://www.dainst.org/de/forschung/forschung-digital/idai.welt target=_blank>iDAI.welt</a></li><li class=divider></li><li><a href="https://gazetteer.dainst.org/" target=_blank>iDAI.gazetteer</a></li><li><a href="http://geoserver.dainst.org/" target=_blank>iDAI.geoserver</a></li><li><a href="http://arachne.uni-koeln.de/" target=_blank>iDAI.objects&nbsp;/&nbsp;Arachne</a></li><li><a href=http://zenon.dainst.org target=_blank>iDAI.bibliography&nbsp;/&nbsp;Zenon</a></li><li><a href=http://archwort.dainst.org/thesaurus/de/vocab target=_blank>iDAI.vocab</a></li><li><a href=http://hellespont.dainst.org target=_blank>Hellespont</a></li></ul></li></ul></div><a href="/" id=projectLogo><img class=pull-left ng-src=img/logo_{{projectId}}.png style="height: 36px; margin-top: 8px;"></a></div><div class=navbar-header ng-init="isCollapsed = true"><button class=navbar-toggle ng-click="isCollapsed = !isCollapsed" type=button><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button><form id=navbar-search ng-submit=search() ng-hide=hideSearchForm class="navbar-left navbar-form input-group form-inline" role=search><input autofocus type=text class=form-control placeholder="neue Suche" ng-model=q name=q> <span class="navbar-left input-group-btn"><button type=submit class="btn btn-default"><span class="glyphicon glyphicon-search"></span></button></span></form></div><div ng-class="isCollapsed ? \'collapse\' : \'in\'" class="collapse navbar-collapse" uib-collapse=isCollapsed style=padding-left:10px><ul class="nav navbar-nav navbar-right"><li ng-repeat="link in dynamicLinkList"><a ng-click=toggleNavbar() ng-href=info/{{link.id}}>{{link.title}}</a></li><li><div ng-if=userObject.username ng-cloak uib-dropdown keyboard-nav><a href=bookmarks class="btn btn-default btn-sm navbar-btn" uib-dropdown-toggle><span class="glyphicon glyphicon-user"></span> &nbsp;{{userObject.username}} <span class=caret></span></a><ul uib-dropdown-menu role=menu style="margin-top:-11px; margin-right: 4px;"><div ng-include="\'partials/navbar-menu.html\'" include-replace></div><li class=divider></li><li><a ng-click=logoutFunction();><span class="glyphicon glyphicon-log-out"></span> &nbsp;{{\'navbar_sign_out\' | transl8}}</a></li></ul></div><div ng-if=!userObject.username ng-cloak class="btn-group btn-group-sm"><a type=button class="btn btn-default navbar-btn" ng-click=loginFunction();><b><span class="glyphicon glyphicon-log-in"></span> &nbsp;{{\'navbar_sign_in\' | transl8}}</b></a> <a ng-if="!hideRegisterButton && !userObject.username" class="btn btn-default navbar-btn" href=register>{{\'navbar_sign_up\' | transl8}}</a></div></li><li ng-if=!hideContactButton style=margin-left:5px><div><a type=button href=contact class="btn btn-sm btn-default navbar-btn"><span class="glyphicon glyphicon-envelope"></span></a></div></li><li style=margin-right:30px></li></ul></div></nav>');
}]);
})();

(function(module) {
try {
  module = angular.module('idai.templates');
} catch (e) {
  module = angular.module('idai.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('partials/directives/idai-picker.html',
    '<div class=idai-picker><script type=text/ng-template id=picker_modal.html><div class="panel panel-default picker-modal"> <div class="panel-heading"> <form class="input-group"> <input ng-keydown="keydown($event)" ng-keypress="keypress($event)" type="text" ng-model="query" class="form-control" autofocus></input> <span class="input-group-btn"> <button ng-click="newQuery()" class="btn btn-default"> <span class="glyphicon glyphicon-search"></span> </button> </span> </form> </div> <div class="panel-body"> <div ng-if="loading" class="loading"></div> <em ng-show="result && total == 0 && !loading">{{ \'picker_no_result\' | transl8 }}</em> <em ng-show="!result && total == 0 && !loading">{{ \'picker_perform_search\' | transl8 }}</em> <div ng-show="total > 0 && !loading" class="text-center small"> <b><i>{{ total | number }} {{ \'results\' | transl8 }}</i></b> </div> </div> <div class="list-group" style="max-height:470px; overflow-y: auto;"> <a href="#" ng-repeat="item in result" class="list-group-item" ng-click="selectItem(item)" ng-class="{ preselected: $index == preselect }"> <div class="row"> <div ng-class="{ \'col-sm-8\': item[\'@id\'], \'col-sm-12\': !item[\'@id\']}"> <span ng-class="{ invisible: $index != preselect }" class="glyphicon glyphicon-menu-right small"></span> {{ getTitleField(item) }} </div> <div class="col-sm-4 text-right" ng-show="item[\'@id\']"> <button class="btn btn-link btn-xs" ng-click="open(item[\'@id\'])" style="padding:0px 5px 1px; border: 0;"> {{ item[\'@id\'] }} <span class="glyphicon glyphicon-new-window" style="font-size:0.8em"></span> </button> </div> </div> </a> <a ng-show="total > offset + limit" href="#" class="list-group-item text-center" ng-click="more()"> ... </a> </div> </div></script><div class=input-group><span class=input-group-btn><button class="btn btn-default" type=button ng-click=openModal()><span class="glyphicon glyphicon-link"></span></button></span> <span class=form-control><span ng-show=!selectedItem>{{ \'pick_an_item\' | transl8 }}</span> <a ng-show="selectedItem && selectedItem[\'@id\']" ng-href="{{ selectedItem[\'@id\'] }}" target=_blank>{{ getTitleField(selectedItem) }}</a> <span ng-show="selectedItem && !selectedItem[\'@id\']">{{ getTitleField(selectedItem) }}</span> <button class="btn btn-link btn-xs" ng-show=selectedItem ng-click="selectedItem = undefined"><span class="glyphicon glyphicon-remove-sign text-muted"></span></button></span></div></div>');
}]);
})();
