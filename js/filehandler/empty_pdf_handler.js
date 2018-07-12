angular
.module("module.fileHandlers.emptyPdfHandler", [])
.factory("emptyPdfHandler", ['$rootScope', 'editables', 'file_manager', 'pdf_file_manager',
    function($rootScope, editables, file_manager, pdf_file_manager) {

    let emptyPdfHandler = new file_manager.FileHandler('empty');

    emptyPdfHandler.description = "Do nothing, just load";
    emptyPdfHandler.fileTypes = ["pdf", "directory"];

    emptyPdfHandler.handleFile = file => pdf_file_manager.loadFiles(file).then(files => files.forEach(file2Articles));

    emptyPdfHandler.createThumbnail = pdf_file_manager.createThumbnail;

    function file2Articles(file) {
        file_manager.stats.analyzed += 1;
    }

    return (emptyPdfHandler);
}])
.run(function(emptyPdfHandler) {emptyPdfHandler.register()});
