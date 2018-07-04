// to be: file_handler_registry
angular
    .module("module.file_handler_manager", [])
    .factory("file_handler_manager", [function() {

        let file_handler_manager = {};
        file_handler_manager.fileHandlers = {};
        file_handler_manager.selected = {};

        /* fileHandler prototype */
        file_handler_manager.FileHandler = function(id) {
            console.log('create new file_handler ' + id);
            if (typeof id === "undefined") {
                console.error("file_handler id needed");
            }
            return {
                id: id,
                fileTypes: [],
                description: 'no description for ' + id,
                register: function() {
                    file_handler_manager.register(this);
                },
                onGotFile: false,
                onGotAll: false
            }
        };

        file_handler_manager.register = function(fileHandler) {
            fileHandler.fileTypes.forEach((fileType) => {
                if (angular.isUndefined(file_handler_manager.fileHandlers[fileType])) {
                    file_handler_manager.fileHandlers[fileType] = {};
                }
                file_handler_manager.fileHandlers[fileType][fileHandler.id] = fileHandler;
                if (angular.isUndefined(file_handler_manager.selected[fileType])) {
                    file_handler_manager.selected[fileType] = false;
                }
            });
        };

        file_handler_manager.getFileHandler = (fileType) => file_handler_manager.fileHandlers[fileType][file_handler_manager.selected[fileType]] || null;

        file_handler_manager.selectDefaultFileHandlers = () => {
            file_handler_manager.selected['pdf'] = 'generic';
            file_handler_manager.selected['csv'] = 'csv_import';
        };

        file_handler_manager.handleFile = function(fileType, data) {
            let fileHandler = file_handler_manager.getFileHandler(fileType);
            if (angular.isFunction(fileHandler.onGotFile)) {
                fileHandler.onGotFile(data)
            }
        };

        file_handler_manager.selectFileHandler = function(fileType, handler) {
            file_handler_manager.selected[fileType] = handler.id || false;
        };

        file_handler_manager.gotAll = function(fileType, data) {
            let fileHandler = file_handler_manager.getFileHandler(fileType);
            if (angular.isFunction(fileHandler.onGotAll)) {
                fileHandler.onGotAll(data)
            }
        };

        return (file_handler_manager);
    }]);