// to be: file_handler_registry
angular
    .module("module.file_manager", [])
    .factory("file_manager", [function() {

        let file_manager = {};
        file_manager.fileHandlers = {};
        file_manager.selected = {};

        file_manager.loadedFiles = {};

        file_manager.reset = function() {
            file_manager.loadedFiles = {};
        };

        /* fileHandler prototype */
        file_manager.FileHandler = function(id) {
            console.log('create new file_handler ' + id);
            if (typeof id === "undefined") {
                console.error("file_handler id needed");
            }
            return {
                id: id,
                fileTypes: [],
                description: 'no description for ' + id,
                register: function() {
                    file_manager.register(this);
                },
                onGotFile: false,
                onGotAll: false
            }
        };

        file_manager.register = function(fileHandler) {
            fileHandler.fileTypes.forEach((fileType) => {
                if (angular.isUndefined(file_manager.fileHandlers[fileType])) {
                    file_manager.fileHandlers[fileType] = {};
                }
                file_manager.fileHandlers[fileType][fileHandler.id] = fileHandler;
                if (angular.isUndefined(file_manager.selected[fileType])) {
                    file_manager.selected[fileType] = false;
                }
            });
        };

        file_manager.getFileHandler = (fileType) => file_manager.fileHandlers[fileType][file_manager.selected[fileType]] || null;

        file_manager.selectDefaultFileHandlers = () => {
            file_manager.selected['pdf'] = 'generic';
            file_manager.selected['csv'] = 'csv_import';
        };

        file_manager.handleFile = function(filePath, fileType) {
            fileType = fileType || file_manager.determineFileType(filePath);
            let fileHandler = file_manager.getFileHandler(fileType);
            if (fileHandler && angular.isFunction(fileHandler.onGotFile)) {
                fileHandler.onGotFile(filePath)
            } else {
                console.log("No File Handler for " + fileType);
            }
        };

        file_manager.handleFileTree = function(tree) {
            if (tree.type === 'directory') {
                tree.contents.forEach(file_manager.handleFileTree);
            } else {
                file_manager.handleFile(tree.path);
            }
        };

        file_manager.selectFileHandler = (fileType, handler) => file_manager.selected[fileType] = handler.id || false;

        const fileExtRegEx = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;

        file_manager.determineFileType = (filePath) => filePath.match(fileExtRegEx) ? filePath.match(fileExtRegEx)[0].substr(1) : '';

        file_manager.loadFile = function(file) {
            let fileType = file_manager.determineFileType(file.path);
            file_manager.handleFile(file, fileType);
        };

        // what if there are not only pdfs in the dir? it's unnice..
        file_manager.loadTree = tree => pdf_file_manager.loadFiles(tree).then(() => file_manager.handleFileTree(tree));

        file_manager.isLoaded = function(file) {
            if (file.type === 'directory') {
                return file.contents.map(file_manager.isLoaded).reduce((v, w) => v && w, true);
            }
            const fileType = file_manager.determineFileType(file.path);
            if (fileType === "pdf") {
                return pdf_file_manager.isLoaded(file.path);
            }
            //other_file_manager.isLoaded(file.path);
            return false;

        };

        return (file_manager);
    }]);