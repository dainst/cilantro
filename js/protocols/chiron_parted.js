angular
.module('module.protocols.chiron_parted', [])
.factory("chiron_parted", ['$rootScope', 'editables', 'protocolregistry', 'documentsource', 'journal',
	function($rootScope, editables, protocolregistry, documentsource, journal) {

	var journalCtrl = new protocolregistry.Protocol('chiron_parted');

	journalCtrl.description = "Chiron - Articles present as single PDFs";



	journalCtrl.init = function(){

		// get document(s)
		documentsource.getDocuments(journal.data.importFilePath);

		$rootScope.$on('gotFile', function($event, idx) {
			documentsource.stats.loaded += 1;

			var pdf = documentsource.files[idx].pdf;

			var article = new journal.Article();
			 // special data for raw articles
			article._.url = documentsource.files[idx].url;
			article._.tmp = [
				{
					fontName: '',
					height: '',
					str: '',
					ypos: 0
				}
			]
			article._.url = idx;
			article._.deleted = idx;

			journal.articles.push(article);

			function getPage(pdf, pageIdx) {
				console.log('get page' + pageIdx);
				pageIdx = pageIdx || 1;
				pdf.getPage(pageIdx).then(function(page) {

					/* fetch text data */
					page.getTextContent(pageIdx).then(function(textContent) {
						if (textContent.items.length < 3) {
							return getPage(pdf, pageIdx + 1);
						}

						for(var k = 0; k < textContent.items.length; k++) {
							var block = textContent.items[k];

							var last = journal.articles[idx]._.tmp[journal.articles[idx]._.tmp.length - 1];

							if ((journal.articles[idx]._.tmp.length > 10) || ((Math.round(block.height) == 10 || Math.round(block.height + 0.2) == 7) && (journal.articles[idx]._.tmp.length > 5))) {
								break;
							}

							//journal.articles[idx].raw += block.height + '\t|\t' + block.fontName + '\t|\t' + block.str + "\n";

							if (((last.fontName != block.fontName) || (last.height != block.height)) && ((last.ypos != block.transform[5]) || (parseInt(block.transform[5]) == 634))) {
								journal.articles[idx]._.tmp.push({
									fontName: block.fontName,
									height: block.height,
									str: '',
									ypos: block.transform[5],
									xpos: block.transform[4]
								});
								// see http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/pdf_reference_1-7.pdf#page=406&zoom=auto,-307,634 and http://stackoverflow.com/questions/18354098/pdf-tm-operator
							}

							var that = journal.articles[idx]._.tmp[journal.articles[idx]._.tmp.length - 1];

							that.str += ' ' + block.str.trim();

						}

						console.log(journal.articles[idx]._.tmp);

						if (journal.articles[idx]._.tmp.length < 5) {
							console.log('not enough text content');
						}

						var b = 1;
						var author = journal.articles[idx]._.tmp[3].str || '';
						var pageNr = journal.articles[idx]._.tmp[2].str;
						var title = '';

						if (!pageNr || !/^[A-Z\W]*$/g.test(author)) {
							var b = 0;
							author = journal.articles[idx]._.tmp[2].str || '';
							pageNr = journal.articles[idx]._.tmp[1].str;
							console.log('alter');
						}


						for (var y = 3 + b; y < journal.articles[idx]._.tmp.length - 1; y++) {
							title += journal.articles[idx]._.tmp[y].str;
						}

						console.log(title, author, pageNr);

						journal.articles[idx].title 	= editables.text(title.trim());
						journal.articles[idx].author 	= editables.authorlist(journalCtrl.caseCorrection(author).split("–"));
						journal.articles[idx].pages 		= editables.page(pageNr, pageIdx - 1, {offset: pageIdx - parseInt(pageNr)});
						journal.articles[idx].pages.value.endpage = parseInt(pageNr) + pdf.pdfInfo.numPages - pageIdx;
						journal.articles[idx].pages.resetDesc();

						journal.articles[idx].order	= editables.number((idx  + 1) * 10);

						//journal.articles[idx]._.tmp = [];

						documentsource.stats.analyzed += 1
					}); //getTextContent

					/* refresh */
					$rootScope.$broadcast('refreshView');

					/* thumbnail */
					documentsource.createThumbnail(page,  article._.id)


				}); // getPage
			}

			getPage(pdf, 1);
		});

	}

	$rootScope.$on('gotAll', function onGotAll() {
		journalCtrl.ready = true;
		$rootScope.$broadcast('refreshView');
	});

	journalCtrl.caseCorrection = function(string) {
		return string.toLowerCase().trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}


	return (journalCtrl);
}])
.run(function(chiron_parted) {chiron_parted.register()})
