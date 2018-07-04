angular
    .module("module.protocolregistry", [])
    .factory("protocolregistry", [function() {

        let registry = {};
        registry.protocols = {};


        /* protocol prototype */
        registry.Protocol = function(id) {
            console.log('create new protocol ' + id);
            if (typeof id === "undefined") {
                console.error("protocol id needed");
            }
            return {
                id: id,
                description: 'no description for ' + id,
                columns: ['author', 'title', 'pages', 'filepath'],
                startView: 'overview',
                main: {},
                register: function() {
                    registry.protocols[this.id] = this;
                },
                onInit: false,
                onSelect: false,
                onGotFile: false,
                onGotAll: false
            }
        };

        return (registry);
    }]);