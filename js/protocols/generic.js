angular
.module("module.protocols.generic", [])
.factory("generic", ['$rootScope', 'editables', 'protocolregistry', 'documentsource', 'journal', 'messenger',
	function($rootScope, editables, protocolregistry, documentsource, journal, messenger) {

	var journalCtrl = new protocolregistry.Protocol('generic');

	journalCtrl.description = "Generic Import protocol";

	journalCtrl.columns = ['attached', 'pages'];

	journalCtrl.onInit = function() {
		journal.data.identification = editables.text('', true); // @ TODO use list!
		journal.data.ojs_journal_code = editables.text('', true);
		journal.data.auto_publish_issue.value.value = true;
		journal.data.default_create_frontpage = true;
		documentsource.getDocuments(journal.data.importFilePath);
	}


	journalCtrl.onGotFile = function(fileName) {

		documentsource.stats.loaded += 1;

		var file = documentsource.files[fileName];

		var article = new journal.Article();
		article.filepath.value.value = file.url;
		article.title.value.value = !angular.isUndefined(file.meta.Title) ? file.meta.Title : '';
		article.abstract.value.value = !angular.isUndefined(file.meta.Subject) ? file.meta.Subject : '';
		article.author.setAuthors(file.meta.Author);
		article.pages.value.startPdf = 1 ;
		article.pages.value.endPdf = file.pagecontext.maximum;
		article.pages.context = file.pagecontext;

		article.date_published.value.value = '';
		if (!angular.isUndefined(file.meta.CreationDate)) {
			if ((m = /^\D\:(\d\d\d\d)(\d\d)(\d\d)/.exec(file.meta.CreationDate)) !== null) {
				article.date_published.value.value = m[3] + '-' + m[2] + '-' + m[1]
			}
		}


		journal.articles.push(article);
		documentsource.stats.analyzed += 1;
		documentsource.updateThumbnail(article);


		console.log(file);
		console.log(file.meta.Title);




	}

	journalCtrl.onAll = function() {
		messenger.alert('All documents loaded', false)
	}

	return (journalCtrl);
}])
.run(function(generic) {generic.register()})
