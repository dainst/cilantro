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

        file_handler_manager.handleFile = function(filePath, fileType) {
            fileType = fileType || file_handler_manager.determineFileType(filePath);
            let fileHandler = file_handler_manager.getFileHandler(fileType);
            if (fileHandler && angular.isFunction(fileHandler.onGotFile)) {
                fileHandler.onGotFile(filePath)
            } else {
                console.log("No File Handler for " + fileType);
            }
        };

        file_handler_manager.handleFileTree = function(tree) {
            if (tree.type === 'directory') {
                tree.contents.forEach(file_handler_manager.handleFileTree);
            } else {
                file_handler_manager.handleFile(tree.path);
            }
        };

        file_handler_manager.selectFileHandler = (fileType, handler) => file_handler_manager.selected[fileType] = handler.id || false;

        const fileExtRegEx = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;

        file_handler_manager.determineFileType = (filePath) => filePath.match(fileExtRegEx) ? filePath.match(fileExtRegEx)[0].substr(1) : '';

        file_handler_manager.loadFile = function(file) {
            let fileType = file_handler_manager.determineFileType(file.path);
            if (fileType === "pdf") {
                pdf_file_manager.loadFiles(file).then(() => file_handler_manager.handleFile(file.path, 'pdf'));
            } else {
                file_handler_manager.handleFile(file, fileType);
            }
        };

        // what if there anre not only pdfs in the dir? it's unnice..
        file_handler_manager.loadTree = tree => pdf_file_manager.loadFiles(tree).then(() => file_handler_manager.handleFileTree(tree));

        file_handler_manager.isLoaded = function(file) {
            if (file.type === 'directory') {
                return file.contents.map(file_handler_manager.isLoaded).reduce((v, w) => v && w, true);
            }
            const fileType = file_handler_manager.determineFileType(file.path);
            if (fileType === "pdf") {
                return pdf_file_manager.isLoaded(file.path);
            }
            //other_file_manager.isLoaded(file.path);
            return false;

        };

        return (file_handler_manager);
    }]);