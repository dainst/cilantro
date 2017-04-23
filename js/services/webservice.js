angular
.module('module.pimportws', [])
.factory("pimportws", ['$log', '$http', '$rootScope', 'settings', 'messenger',
	function($log, $http, $rootScope, settings, messenger) {

	var pimportws = {};
	
	pimportws.sec = {
		password: ''
	}

	pimportws.repository = [];
	
	pimportws.uploadId = false; // should be named session Id because that is what it is actuallly

	pimportws.get = function(task, data, callback) {
		$log.log('get', task);
		
		//$log.log(settings.server_url, send);		
		
		if (settings.devMode) {
			pimportws.sec.password = 'alpha';
		}
		
		$http({
			method:	'POST',
			url: settings.server_url,
			data: {
				task: task,
				data: pimportws.ojsisQuery(data)
			}
		}).then(
			function(response) {
				if (response.data.success == false) {
					$log.error(response.data.message);
				}  else {
					$log.log("uid", pimportws.uploadId);

					if (!pimportws.uploadId) {
						pimportws.uploadId = response.data.uploadId;
					}
					if (pimportws.uploadId != response.data.uploadId) {
						$log.log("got new uploadID, that's so wrong", pimportws.uploadId, response.data.uploadId);
					}
				}

				messenger.cast(response.data);
				callback(response.data);
			},
			function(err) {
				messenger.alert(err,1);
				console.error(err);
				callback(err);
			}
		);
	}
	
	pimportws.ojsisQuery = function(send) {
		send = send ||  {};
		if (pimportws.sec.password) {
			send.password = pimportws.sec.password;
		}
		if (pimportws.uploadId) {
			send.uploadId = pimportws.uploadId;
		}
		//$log.log(send);
		return send;
	}

	return pimportws;
}]);