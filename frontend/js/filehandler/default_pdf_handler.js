angular
.module("module.fileHandlers.defaultPdfHandler", [])
.factory("defaultPdfHandler", ['$rootScope', 'editables', 'fileManager', 'pdfFileManager', 'dataset',
    function($rootScope, editables, fileManager, pdfFileManager, dataset) {

    let defaultPdfHandler = new fileManager.FileHandler('generic');

    defaultPdfHandler.description = "Create an Article for each PDF-File. Each PDF represents one Article.";
    defaultPdfHandler.fileTypes = ["pdf", "directory"];

    defaultPdfHandler.handleFile = file => pdfFileManager.loadFiles(file).then(files => files.forEach(file2Articles));

    defaultPdfHandler.createThumbnail = pdfFileManager.createThumbnail;

    function file2Articles(file) {
        const fileInfo = fileManager.loadedFiles[file.path];
        if (angular.isUndefined(fileInfo)) return;
        const article = new dataset.Subobject();
        article.filepath.value.value = fileInfo.url;
        article.title.value.value = !angular.isUndefined(fileInfo.meta.Title) ? fileInfo.meta.Title : '';
        article.abstract.value.value = !angular.isUndefined(fileInfo.meta.Subject) ? fileInfo.meta.Subject : '';
        article.author.setAuthors(fileInfo.meta.Author);
        article.pages.value.startPdf = 1 ;
        article.pages.value.endPdf = fileInfo.pagecontext.maximum;
        article.pages.context = fileInfo.pagecontext;

        article.date_published.value.value = '';
        if (!angular.isUndefined(fileInfo.meta.CreationDate)) {
            if ((m = /^\D:(\d\d\d\d)(\d\d)(\d\d)/.exec(fileInfo.meta.CreationDate)) !== null) {
                article.date_published.value.value = m[3] + '-' + m[2] + '-' + m[1]
            }
        }

        dataset.subobjects.push(article);
        fileManager.stats.analyzed += 1;
        console.log(article);
        article._.createThumbnail();

        console.log("found title: " + fileInfo.meta.Title);

    }

    return (defaultPdfHandler);
}])
.run(function(defaultPdfHandler) {defaultPdfHandler.register()});
