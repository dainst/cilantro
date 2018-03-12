angular
	.module('module.messenger', [])
	.factory("messenger", ["$rootScope", function($rootScope) {
		var messenger = {};

		messenger.content = {}
		messenger.content.message = '';
		messenger.content.success = true;
		messenger.content.warnings = [];
		messenger.content.debug = [];

		/**
		 * the distinguation between debug-info, warnings and the message itself (instead of having one single log,
		 * containingg different types of msgs ) is a little bit clunky and emerged from the way the webservice creates
		 * messages. it can be changed sometimes if it's inherent inelegance bothers to much, but it does it job
		 *
		 */

		/**
		 * should be like
			 a:  1,
			 b: 123,
			 n: 50,
			 _isOk: function(k ,v) {
					return v > 75;
				}
		 */
		messenger.content.stats = {}

		/**
		 * set message box content
		 * @param content
		 * @param append - set true if msg should be appended to message box.
		 */
		messenger.cast = function(content, append) {
			append = append || false;

			if (append) {
				if (!content.success) {
					messenger.content.warnings.push(content.message)
				} else {
					messenger.content.debug.push(content.message)
				}

				$rootScope.$broadcast('refreshView');
				return;
			}

			messenger.content.message = content.message;
			messenger.content.success = content.success;
			messenger.content.warnings = content.warnings || [];
			messenger.content.debug = content.debug || [];

			if (!messenger.content.message) {
				messenger.content.message = (content.success) ? '' : 'Unknown Error';
				messenger.content.message += (content.warnings && content.warnings.length > 0) ? '(Some warnings)' : '';
			}

			$rootScope.$broadcast('refreshView');
		}

		/**
		 * set message box content quick access
		 * @param msg (String or error)
		 * @param isError
		 * @param append - set true if msg should be appended
		 */
		messenger.alert = function(msg, isError, append) {
			console.log('MSG', msg);

			let debug = [];
			if (typeof msg.message !== "undefined") {
				if (settings.devMode()) {
					debug = [msg.stack];
				}
				msg = msg.message;
			}

			append = append || false;
			if ((!messenger.content.success && (messenger.content.message !== '')) || append) {
				messenger.content.warnings.push(messenger.content.message);
			}
			messenger.content.message = msg;
			messenger.content.success = !isError;
			messenger.content.debug = debug;
			$rootScope.$broadcast('refreshView');
		}


		/**
		 * reset status (except stats) to normal
		 */
		messenger.ok = function() {
			console.log('OK');
			messenger.content.message = '';
			messenger.content.success = true;
			messenger.content.warnings = [];
			messenger.content.debug = [];
			$rootScope.$broadcast('refreshView');
		}



		return (messenger);
	}]
)
