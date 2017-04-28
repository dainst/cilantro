// service wich works with the chiron pdfs

angular
.module('module.protocols.testdata', [])
.factory("testdata", ['protocolregistry', 'journal',
	function(protocolregistry, journal) {


	var journalCtrl = new protocolregistry.Protocol('testdata');

	journalCtrl.description = "Create some Testdata 3.0";

	journalCtrl.startView = 'articles';


	/* the journal's settings */
	journalCtrl.columns = ['title'];

	journalCtrl.init = function() {
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

	};




	return (journalCtrl);


}])
.run(function(testdata) {testdata.register()})