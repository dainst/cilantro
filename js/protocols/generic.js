angular
.module("module.fileHandlers.generic", [])
.factory("generic", ['$rootScope', 'editables', 'file_handler_manager', 'pdf_file_manager', 'dataset', 'messenger',
    function($rootScope, editables, file_handler_manager, pdf_file_manager, dataset, messenger) {

    let journalCtrl = new file_handler_manager.FileHandler('generic');

    journalCtrl.description = "Create an Article for each PDF-File. Each PDF represents one Article.";
    journalCtrl.fileTypes = ["pdf"];


    journalCtrl.onGotFile = function(fileName) {



        let file = pdf_file_manager.files[fileName];

        let article = new dataset.Article();
        article.filepath.value.value = file.url;
        article.title.value.value = !angular.isUndefined(file.meta.Title) ? file.meta.Title : '';
        article.abstract.value.value = !angular.isUndefined(file.meta.Subject) ? file.meta.Subject : '';
        article.author.setAuthors(file.meta.Author);
        article.pages.value.startPdf = 1 ;
        article.pages.value.endPdf = file.pagecontext.maximum;
        article.pages.context = file.pagecontext;

        article.date_published.value.value = '';
        if (!angular.isUndefined(file.meta.CreationDate)) {
            if ((m = /^\D:(\d\d\d\d)(\d\d)(\d\d)/.exec(file.meta.CreationDate)) !== null) {
                article.date_published.value.value = m[3] + '-' + m[2] + '-' + m[1]
            }
        }

        dataset.articles.push(article);
        pdf_file_manager.stats.analyzed += 1;
        pdf_file_manager.updateThumbnail(article);

        console.log(file.meta.Title);

    };


    return (journalCtrl);
}])
.run(function(generic) {generic.register()});
