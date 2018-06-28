angular
.module("module.protocols.generic", [])
.factory("generic", ['$rootScope', 'editables', 'protocolregistry', 'documentsource', 'dataset', 'messenger',
	function($rootScope, editables, protocolregistry, documentsource, dataset, messenger) {

	let journalCtrl = new protocolregistry.Protocol('generic');

	journalCtrl.description = "Generic Import protocol";


	journalCtrl.onSelect = function() {
		dataset.data.identification.select('year');
		dataset.data.auto_publish_issue.value.value = false;
		dataset.data.default_create_frontpage = true;
		dataset.data.number.mandatory = false;
		dataset.data.volume.mandatory = false;
	}

	journalCtrl.onInit = function() {
		documentsource.getDocuments(dataset.data.importFilePath);
	}


	journalCtrl.onGotFile = function(fileName) {

		documentsource.stats.loaded += 1;

		let file = documentsource.files[fileName];

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
		documentsource.stats.analyzed += 1;
		documentsource.updateThumbnail(article);

		console.log(file);
		console.log(file.meta.Title);

	}

	journalCtrl.onGotAll = function() {
		journalCtrl.ready = true;
		messenger.success('All documents loaded')
	}

	return (journalCtrl);
}])
.run(function(generic) {generic.register()})
