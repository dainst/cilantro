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
