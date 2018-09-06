angular
	.module('module.messenger', [])
	.factory("messenger", [function() {

	    const messenger = {};

        messenger.messages = [];

		messenger.Message = function(text, type, main) {
		  let msg = {};
		  msg.text = text;
		  msg.type = type || "info";
		  msg.main = angular.isUndefined(main) ? false : main;
		  msg.timestamp = Date.now();
		  return msg;
        };

		messenger.push = function(text, type, isMain) {
		    const message = new messenger.Message(text, type, isMain);
            messenger.messages.unshift(message);
		    return message;
        };

        messenger.warning = (text) => messenger.push(text, "warning");
        messenger.error = (text) =>  messenger.push(text, "error", true);
        messenger.success = (text) => messenger.push(text, "success", true);
        messenger.info = (text) => messenger.push(text, "info");
        messenger.debug = (text) => messenger.push(text, "debug");

        messenger.ok = () => messenger.messages.forEach(message => message.main = false);

        messenger.clear = function() {
            messenger.messages = [];
        };

        messenger.getMainMessage = () => messenger.messages.filter(msg => msg.main)[0] || messenger.messages[0];

		return (messenger);
	}]
);
