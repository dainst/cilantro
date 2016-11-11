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
