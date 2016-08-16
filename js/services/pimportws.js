angular
.module('module.pimportws', [])
.factory("pimportws", ['$log', '$http', 'settings', function($log, $http, settings) {

	var pimportws = {};
	
	pimportws.sec = {};//  password

	pimportws.get = function(task, data, callback) {
		$log.log('get', task);
		var send = data;
		angular.extend(send, pimportws.sec);
		
		//$log.log(settings.server_url, send);		
		
		$http({
			method:	'POST',
			url: settings.server_url,
			data: {
				task: task,
				data: send
			}
		}).then(
			function(response) {
				if (response.data.success == false) {
					$log.error(response.data.message);
				}
				callback(response.data);
			},
			function(err) {
				$log.error(err);
				callback(err);
			}
		);
	}

	return pimportws;
}]);