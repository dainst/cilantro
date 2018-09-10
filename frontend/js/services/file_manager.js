angular
    .module("module.fileManager", [])
    .factory("fileManager", ['webservice', function(webservice) {

        const fileExtRegEx = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;

        const file_manager = {};
        file_manager.fileHandlers = {};
        file_manager.selected = {};

        file_manager.loadedFiles = {};
        file_manager.stats = {};
        file_manager.ready = false;

        file_manager.reset = function() {
            file_manager.ready = false;
            file_manager.loadedFiles = {};
            file_manager.stats  = {
                files: 0,
                analyzed: 0,
                loaded:  0,
                thumbnails: 0
            };
        };

        file_manager.getStats = () => file_manager.stats;

        file_manager.isStatOk = (k, v) => (v >= file_manager.stats.files ? 1 : -1);

        file_manager.getFileStatus = (file) => (file.type === 'directory')
            ? file.contents.map(file_manager.getFileStatus).reduce((v, w) => v && w, true)
            : file_manager.loadedFiles[file.path] && true;

        file_manager.mimeTypeFromExtension = (filePath) =>
            filePath.match(fileExtRegEx) ? filePath.match(fileExtRegEx)[0].substr(1) : '';

        file_manager.determineFileType = (file) =>
            file.type === "directory" ? "directory" : file_manager.mimeTypeFromExtension(file.path);

        file_manager.getFileHandler = (fileType) =>
            file_manager.fileHandlers[fileType] &&
            file_manager.fileHandlers[fileType][file_manager.selected[fileType]] || null;

        file_manager.setFileHandler = (fileType, handler) => file_manager.selected[fileType] = handler.id || false;

        file_manager.selectDefaultFileHandlers = () => {
            file_manager.selected['directory'] = 'generic';
            file_manager.selected['pdf'] = 'generic';
            file_manager.selected['csv'] = 'csv_import';
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
                register: function() {file_manager.registerHandler(this)},
                handleFile: () => {},
                createThumbnail: false
            }
        };

        file_manager.registerHandler = function(fileHandler) {
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

        file_manager.handleFile = function(file) {
            const fileType = file_manager.determineFileType(file);
            const fileHandler = file_manager.getFileHandler(fileType);
            if (fileHandler) {
                fileHandler.handleFile(file);
            } else {
                console.log("No File Handler for ", file);
            }
        };

        file_manager.createThumbnail = function(params) {
            if (angular.isUndefined(params["filePath"]) && file_manager.loadedFiles[params["filePath"]]) {
                return console.log("could not create thumbnail:", params);
            }
            const fileType = file_manager.mimeTypeFromExtension(params["filePath"]);
            const fileHandler = file_manager.getFileHandler(fileType);
            if (fileHandler && angular.isFunction(fileHandler.createThumbnail)) {
                return fileHandler.createThumbnail(params)
            } else {
                console.log("No Thumbnail creating File Handler for ", file);
                return false;
            }
        };

        file_manager.loadFile = function(file) {
            const fileType = file_manager.determineFileType(file);
            file_manager.handleFile(file, fileType);
        };

        file_manager.loadFileContents = (file) =>
            file.type === "directory"
                ? file.contents.forEach(file_manager.loadFileContents)
                : webservice
                    .get(['files_url', file.path])
                    .then(fileContent => {
                        file_manager.loadedFiles[file.path] = fileContent;
                        return [fileContent]
                    })
                    .catch(err => {
                        file_manager.loadedFiles[file.path] = false;
                        return[]
                    });

        return (file_manager);
    }]);