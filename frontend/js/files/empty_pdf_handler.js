angular
.module("module.fileHandlers.emptyPdfHandler", [])
.factory("emptyPdfHandler", ['$rootScope', 'editables', 'fileManager', 'pdfFileManager',
    function($rootScope, editables, fileManager, pdfFileManager) {

    let emptyPdfHandler = new fileManager.FileHandler('empty');

    emptyPdfHandler.description = "Do nothing, just load";
    emptyPdfHandler.fileTypes = ["pdf", "directory"];

    emptyPdfHandler.handleFile = file => pdfFileManager.loadFiles(file).then(files => files.forEach(file2Articles));

    emptyPdfHandler.createThumbnail = pdfFileManager.createThumbnail;

    function file2Articles(file) {
        fileManager.stats.analyzed += 1;
    }

    return (emptyPdfHandler);
}])
.run(function(emptyPdfHandler) {emptyPdfHandler.register()});
