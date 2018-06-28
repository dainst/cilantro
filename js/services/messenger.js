angular
	.module('module.messenger', [])
	.factory("messenger", ["$rootScope", "settings", function($rootScope, settings) {

	    const messenger = {};

        messenger.messages = [];

        messenger.main = false;

		messenger.Message = function(text, type) {
		  let msg = {};
		  msg.text = text;
		  msg.type = type || "info";
		  msg.timestamp = Date.now();
		  return msg;
        };

		messenger.push = function(text, type, isMain) {
		    const message = new messenger.Message(text, type);
		    if (isMain) {
                messenger.main = message;
                console.log("NEWMAIN", message);
            }
            messenger.messages.unshift(message);
		    return message;
        };

        messenger.warning = (text) => messenger.push(text, "warning");
        messenger.error = (text) =>  messenger.push(text, "error", true);
        messenger.success = (text) => messenger.push(text, "success", true);
        messenger.info = (text) => messenger.push(text, "info");
        messenger.debug = (text) => messenger.push(text, "debug");

        messenger.ok = () => messenger.main = false;

        messenger.clear = function() {
            messenger.messages = [];
            messenger.main = false;
        };

		return (messenger);
	}]
);
