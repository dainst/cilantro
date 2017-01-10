// service wich works with the chiron pdfs

angular
.module('module.testdata', [])
.factory("testdata", ['$log', 'editables', function($log, editables) {

	var bob = function() {
		var self = this;
	};
	
	bob.title = 'Create Testdata';
	bob.template = 'journals/testdata/testdata.html';
	
	bob.init = function()  {
		bob.journal.identification = 'vol_year';
		bob.journal.ojs_journal_code = 'test';
		bob.journal.journal_code = 'testdata';		
		bob.journal.auto_publish_issue.value.value = false;
		bob.journal.default_create_frontpage = true;

	}
	
	bob.start = function() {
		
		bob.journal.volume.value.value = Math.round(Math.random() * 10000);
		bob.journal.year.value.value = Math.round(Math.random() * 10000);
		
		bob.forwardArticle({
			'title':			editables.base('Crete'),
			'abstract':			editables.text('', false),
			'author':			editables.authorlist(['Peter Parker', 'Bruce Wayne']),
			'pages':			editables.page(1, 'Seite eins!'),
			'date_published':	editables.base('03-03-1999'),
			'filepath':			'test.pdf',
			'thumbnail':		'',
			'order':			editables.number(1),
			'createFrontpage':	editables.checkbox(true)
		});
		
		bob.forwardArticle({
			'title':			editables.base('A lady centaur.'),
			'abstract':			editables.text('Testeintrag', false),
			'author':			editables.authorlist(['Selina Kyle', 'Dr. X']),
			'pages':			editables.page(1, '1'),
			'date_published':	editables.base('03-03-1999'),
			'filepath':			'test2.pdf',
			'thumbnail':		'',
			'order':			editables.number(2),
			'createFrontpage':	editables.checkbox(true)
		}, true);
		
		bob.nextTab();
				
	}
	
	return (bob);
}]);