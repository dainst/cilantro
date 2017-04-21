angular
	.module('module.messenger', [])
	.factory("messenger", function() {
		var messenger = {};

		messenger.content = {}
		messenger.content.message = '';
		messenger.content.success = true;
		messenger.content.warnings = [];
		messenger.content.debug = [];

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

		messenger.status = function(status) {
			messenger.content.status = status;
		}

		/**
		 * set message box content
		 * @param content
		 */
		messenger.cast = function(content) {
			messenger.content.message = content.message;
			messenger.content.success = content.success;
			messenger.content.warnings = content.warnings || [];
			messenger.content.debug = content.debug || [];

			if (!messenger.content.message) {
				messenger.content.message = (content.success) ? 'OK' : 'Not OK';
				messenger.content.message += (content.warnings) ? ' with warnings' : '';
			}

		}

		/**
		 * set message box content quick access
		 * @param msg
		 * @param isError
		 */
		messenger.alert = function(msg, isError) {
			console.log('MSG', msg);
			messenger.content.message = msg;
			messenger.content.success = !isError;
			messenger.content.warnings = [];
			messenger.content.debug = [];
		}


		/**
		 * reset status (except stats) to normal
		 */
		messenger.ok = function() {
			messenger.content.message = '';
			messenger.content.success = true;
			messenger.content.warnings = [];
			messenger.content.debug = [];
		}



		return (messenger);
	}
)