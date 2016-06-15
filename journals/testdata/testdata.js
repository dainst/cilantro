// service wich works with the chiron pdfs

angular
.module('module.testdata', [])
.factory("testdata", ['$log', 'editables', function($log, editables) {

	var bob = function() {
		var self = this;
	};
	
	bob.title = 'Create Testdata';
	bob.template = 'journals/testdata/testdata.html';
	
	bob.start = function() {
		
		bob.journal.identification = 'vol_year';
		bob.journal.ojs_journal_code = 'test';
		bob.journal.journal_code = 'testdata';
		bob.journal.ojs_user = 'admin';
		
		bob.journal.volume.value.value = Math.round(Math.random() * 10000);
		bob.journal.year.value.value = Math.round(Math.random() * 10000);
		
		bob.forwardArticle({
			'title':			editables.base('Erster Testeintrag'),
			'abstract':			editables.text('', false),
			'author':			editables.authorlist(['Peter Parker', 'Bruce Wayne']),
			'pages':			editables.page(1, 'Seite eins!'),
			'date_published':	editables.base('03-03-1999'),
			'filepath':			'http://195.37.232.186/test/test.pdf',
			'thumbnail':		''
		});
		
		bob.forwardArticle({
			'title':			editables.base('Zweiter Testeintrag'),
			'abstract':			editables.text('', false),
			'author':			editables.authorlist(['Selina Kyle', 'Dr. X']),
			'pages':			editables.page(10, '10'),
			'date_published':	editables.base('03-03-1999'),
			'filepath':			'http://195.37.232.186/test/test2.pdf',
			'thumbnail':		''
		});
		
		bob.nextTab();
		
		
		bob.refresh();
		
	}
	
	return (bob);
}]);