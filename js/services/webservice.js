angular
.module('module.webservice', [])
.factory("webservice", ['$log', '$http', '$rootScope', 'settings', 'messenger',
	function($log, $http, $rootScope, settings, messenger) {

	var webservice = {};
	
	webservice.sec = {
		password: ''
	}

	webservice.repository = [];
	
	webservice.uploadId = false; // should be named session Id because that is what it is actuallly

	webservice.get = function(task, data, callback) {
		$log.log('get', task);
		
		//$log.log(settings.server_url, send);		
		
		if (settings.devMode) {
			webservice.sec.password = 'alpha';
		}
		
		$http({
			method:	'POST',
			url: settings.server_url,
			data: {
				task: task,
				data: webservice.ojsisQuery(data)
			}
		}).then(
			function(response) {
				if (response.data.success == false) {
					$log.error(response.data.message);
				}  else {
					$log.log("uid", webservice.uploadId);

					if (!webservice.uploadId) {
						webservice.uploadId = response.data.uploadId;
					}
					if (webservice.uploadId != response.data.uploadId) {
						$log.log("got new uploadID, that's so wrong", webservice.uploadId, response.data.uploadId);
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
	
	webservice.ojsisQuery = function(send) {
		send = send ||  {};
		if (webservice.sec.password) {
			send.password = webservice.sec.password;
		}
		if (webservice.uploadId) {
			send.uploadId = webservice.uploadId;
		}
		//$log.log(send);
		return send;
	}

	return webservice;
}]);