// to be: file_handler_registry
angular
    .module("module.file_handler_manager", [])
    .factory("file_handler_manager", ['pdf_file_manager', function(pdf_file_manager) {

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

        file_handler_manager.handleFile = function(fileType, filePath) {
            let fileHandler = file_handler_manager.getFileHandler(fileType);
            if (fileHandler && angular.isFunction(fileHandler.onGotFile)) {
                fileHandler.onGotFile(filePath)
            } else {
                console.log("No File Handler for " + fileType);
            }
        };

        file_handler_manager.selectFileHandler = (fileType, handler) => file_handler_manager.selected[fileType] = handler.id || false;

        const fileExtRegEx = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;

        file_handler_manager.determineFileType = (filePath) => filePath.match(fileExtRegEx) ? filePath.match(fileExtRegEx)[0].substr(1) : '';

        file_handler_manager.loadFile = function(filePath, fileType) {
            fileType = fileType || file_handler_manager.determineFileType(filePath);
            if (fileType === "pdf") {
                pdf_file_manager.getDocuments(filePath).then(() => file_handler_manager.handleFile(fileType, filePath));
            } else {
                file_handler_manager.handleFile(fileType, filePath);
            }
        };

        file_handler_manager.isFileLoaded = function(filePath, fileType) {
            fileType = fileType || file_handler_manager.determineFileType(filePath);
            if (fileType === "pdf") {
                return pdf_file_manager.isLoaded(filePath);
            } else {
                //other_file_manager.isLoaded(filePath);
                return false;
            }
        };

        file_handler_manager.loadDir = function(dirPath) {
            console.log("Load directory " + dirPath);
        };

        return (file_handler_manager);
    }]);