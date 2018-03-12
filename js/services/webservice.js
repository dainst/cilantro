angular
.module('module.webservice', [])
.factory("webservice", ['$http', '$rootScope', 'settings', 'messenger',
	function($http, $rootScope, settings, messenger) {

	var webservice = {};
	
	webservice.sec = {
		password: 'alpha'
	}

	webservice.repository = [];
	
	webservice.uploadId = false; // should be named session Id because that is what it is actuallly

			/**
		 *
		 * @param task, the webservice shall be called (function of ojsis.php)
		 * @param data, to be given to that function
		 * @param callback, to be called back when done
		 * @param appendLog, set true if messenmger should not be cleared
		 */
	webservice.get = function(task, data, callback, appendLog) {
		appendLog = appendLog || false;
		console.log('get', task);
		
		//console.log(settings.server_url, send);		
		
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
					console.error(response.data.message);
				}  else {
					console.log("uid", webservice.uploadId);

					if (!webservice.uploadId) {
						webservice.uploadId = response.data.uploadId;
					}
					if (webservice.uploadId != response.data.uploadId) {
						console.log("got new uploadID, that's so wrong", webservice.uploadId, response.data.uploadId);
					}
				}
				messenger.cast(response.data, appendLog);
				callback(response.data);
			},
			function(err) {
				messenger.alert(err,1, appendLog);
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
		//console.log(send);
		return send;
	}

	webservice.getFileInfo = function(path) {
		// not elegant, but hey okay
		for (var i=0; i < webservice.repository.length; i++) {
			if (webservice.repository[i].path == path) {
				return webservice.repository[i];
			}
		}
		messenger.alert(path + ' is not found in repository');
	}


	return webservice;
}]);

