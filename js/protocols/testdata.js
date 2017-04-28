// service wich works with the chiron pdfs

angular
.module('module.protocols.testdata', [])
.factory("testdata", ['$log', 'editables', 'protocolregistry', function($log, editables, protocolregistry) {


	var journalCtrl = new protocolregistry.Protocol('testdata');

	journalCtrl.description = "Create some Testdata 3.0";


	/* the journal's settings */
	journalCtrl.columns = ['title'];

	journalCtrl.init = function() {
		journalCtrl.main.articles.push(new journalCtrl.main.Article({
			title: "A lady centaur",
			author: {firstname:'1peter', lastname: '1parker'},
			pages: 1
		}));
		journalCtrl.main.articles.push(new journalCtrl.main.Article({
			title: "Something else",
			author: {firstname:'2peter', lastname: '2parker'},
			pages: 1
		}));
		journalCtrl.main.articles.push(new journalCtrl.main.Article({
			title: "Geh, Schwurbel!",
			author: {firstname:'3peter', lastname: '3parker'},
			pages: 1
		}));
		journalCtrl.main.articles.push(new journalCtrl.main.Article({
			title: "DER ARTIKEL",
			author: {firstname:'4Piller', lastname: '4Mann'},
			pages: 1
		}));
		journalCtrl.main.articles.push(new journalCtrl.main.Article({
			title: "Alter, wie das Nervt",
			author: {firstname:'5Piller', lastname: '5Mann'},
			pages: 1
		}));
		console.log(journalCtrl.main.articles);
		journalCtrl.main.steps.change('articles');
	};




	return (journalCtrl);


}])
.run(function(testdata) {testdata.register()})