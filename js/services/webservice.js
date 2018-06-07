angular
.module('module.webservice', [])
.factory("webservice", ['$http', '$rootScope', 'settings', 'messenger', 'repository',
	function($http, $rootScope, settings, messenger, repository) {

	let webservice = {};

	webservice.sec = {
		password: settings.password || ''
	};

	webservice.loading = false;

	webservice.repository = repository;

	webservice.uploadId = false; // should be named session Id because that is what it is actuallly

		/**
		 *
		 * @param task, the webservice shall be called (function of ojsis.php)
		 * @param data, to be given to that function
		 * @param callback, to be called back when done
		 * @param appendLog, set true if messenger should not be cleared
         * @param showLoader, set tru to lock app while loading
		 */
	webservice.get = function(task, data, callback, appendLog, showLoader) {
		appendLog = appendLog || false;
        showLoader = showLoader || false;
        webservice.loading = showLoader;

        console.log('get', task);

        settings._loaded.then(function() {
            $http({
                method:	'POST',
                url: settings.server_url,
                data: {
                    task: task,
                    data: webservice.ojsisQuery(data)
                }
            }).then(
                function(response) {
                    webservice.loading = false;
                    if (response.data.success === false) {
                        console.error(response.data.message);
                    }  else {
                        console.log("uid", webservice.uploadId);

                        if (!webservice.uploadId) {
                            webservice.uploadId = response.data.uploadId;
                        }
                        if (webservice.uploadId !== response.data.uploadId) {
                            console.log("got new uploadID, that's so wrong", webservice.uploadId, response.data.uploadId);
                        }
                    }
                    messenger.cast(response.data, appendLog);
                    callback(response.data);
                },
                function(err) {
                    webservice.loading = false;
                    messenger.alert(err,1, appendLog);
                    console.error(err);
                    callback(err);
                }
            );
		});

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
		if (!path) {
			return;
		}
		// not elegant, but hey okay
		for (let i = 0; i < webservice.repository.length; i++) {
			if (webservice.repository[i].path === path) {
				return webservice.repository[i];
			}
		}
		messenger.alert(path + ' is not found in repository');
	}


	return webservice;
}]);
