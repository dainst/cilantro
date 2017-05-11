/**
 * this service is just a registry for the protocols...
 *
 * I am quite sure this is overly complicated, but I really don't know how to do it otherway. angular is confusing the shit out of me.
 */
angular
	.module("module.protocolregistry", [])
	.factory("protocolregistry", [function() {

		var registry = {};
		registry.protocols = {};


		/* protocol prototype */
		registry.Protocol = function (id) {
			console.log('create new protocol ' + id);
			if (typeof id === "undefined") {
				console.error("protocol id needed");
			}
			var p = {
				id: id,
				description: 'no description for ' + id,
				columns: ['author', 'title', 'pages'],
				startView: 'overview',
				main: {},
				register: function() {
					registry.protocols[this.id] = this;
				},
				init: false
			}


			return p
		}



		return (registry);
	}]);