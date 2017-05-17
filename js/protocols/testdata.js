// service wich works with the chiron pdfs

angular
.module('module.protocols.testdata', [])
.factory("testdata", ['protocolregistry', 'journal', 'documentsource',
	function(protocolregistry, journal, documentsource) {


	var journalCtrl = new protocolregistry.Protocol('testdata');

	journalCtrl.description = "Create some Testdata 3.0";

	journalCtrl.startView = 'publish';


	/* the journal's settings */
	journalCtrl.columns = ['title'];

	journalCtrl.onInit = function() {
		journal.articles.push(new journal.Article({
			title: "A lady centaur",
			author: {firstname:'1peter', lastname: '1parker'},
			pages: 1
		}));
		journal.articles.push(new journal.Article({
			title: "Something else",
			author: {firstname:'2peter', lastname: '2parker'},
			pages: 1
		}));
		journal.articles.push(new journal.Article({
			title: "Geh, Schwurbel!",
			author: {firstname:'3peter', lastname: '3parker'},
			pages: 1
		}));
		journal.articles.push(new journal.Article({
			title: "DER ARTIKEL",
			author: {firstname:'4Piller', lastname: '4Mann'},
			pages: 1
		}));
		journal.articles.push(new journal.Article({
			title: "Alter, wie das Nervt",
			author: {firstname:'5Piller', lastname: '5Mann'},
			pages: 1
		}));
		journal.data.volume.value.value = '123';
		journal.data.year.value.value = '123';
		documentsource.ready = true;
		console.log(journal.get())
	};




	return (journalCtrl);


}])
.run(function(testdata) {testdata.register()})