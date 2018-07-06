// service wich works with the chiron pdfs

angular
.module('module.fileHandlers.testdata', [])
.factory("testdata", ['file_manager', 'dataset',
	function(file_manager, dataset) {


	let journalCtrl = new file_manager.FileHandler('testdata');

	journalCtrl.description = "Create some Testdata 3.0";

	journalCtrl.startView = 'articles';


	/* the journal's settings */
	journalCtrl.columns = ['title'];

	journalCtrl.onInit = function() {

		let a = new dataset.Article({
			zenonId: "000371801",
			author: {firstname:'1peter', lastname: '1parker'},
			pages: 1
		});
		a._.autoFetchFromZenon = true;

		dataset.articles.push(a);
		dataset.articles.push(new dataset.Article({
			title: "Something else",
			author: {firstname:'2peter', lastname: '2parker'},
			pages: 1
		}));
		dataset.articles.push(new dataset.Article({
			title: "Geh, Schwurbel!",
			author: {firstname:'3peter', lastname: '3parker'},
			pages: 1
		}));
		dataset.articles.push(new dataset.Article({
			title: "DER ARTIKEL",
			author: {firstname:'4Piller', lastname: '4Mann'},
			pages: 1
		}));
		dataset.articles.push(new dataset.Article({
			title: "Alter, wie das Nervt",
			author: {firstname:'5Piller', lastname: '5Mann'},
			pages: 1
		}));
		pdf_file_manager.ready = true;
	};

	journalCtrl.onSelect= function() {
		dataset.data.volume.value.value = Math.round(Math.random()*10000);
		dataset.data.year.value.value = Math.round(Math.random()*10000);
		dataset.data.number.value.value = Math.round(Math.random()*10000);
        dataset.data.allow_upload_without_file = true;
	}




	return (journalCtrl);


}])
.run(function(testdata) {testdata.register()});