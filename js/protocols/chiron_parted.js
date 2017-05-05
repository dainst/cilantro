angular
.module('module.protocols.chiron_parted', [])
.factory("chiron_parted", ['$rootScope', 'editables', 'protocolregistry', 'documentsource', 'journal',
	function($rootScope, editables, protocolregistry, documentsource, journal) {

	var journalCtrl = new protocolregistry.Protocol('chiron_parted');

	journalCtrl.description = "Chiron - Articles present as single PDFs";

	journalCtrl.init = function() {
		// get document(s)
		documentsource.getDocuments(journal.data.importFilePath);
	}

	journalCtrl.onGotFile = function(fileName) {

		documentsource.stats.loaded += 1;

		var pdf = documentsource.files[fileName].pdf;

		var article = new journal.Article();
		 // special data for raw articles
		article._.url = documentsource.files[fileName].url;
		article._.tmp = [
			{
				fontName: '',
				height: '',
				str: '',
				ypos: 0
			}
		]

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

					function caseCorrection(string) {
						return string.toLowerCase().trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
					}

					for(var k = 0; k < textContent.items.length; k++) {
						var block = textContent.items[k];

						var last = article._.tmp[article._.tmp.length - 1];

						if ((article._.tmp.length > 10) || ((Math.round(block.height) == 10 || Math.round(block.height + 0.2) == 7) && (article._.tmp.length > 5))) {
							break;
						}

						//article.raw += block.height + '\t|\t' + block.fontName + '\t|\t' + block.str + "\n";

						if (((last.fontName != block.fontName) || (last.height != block.height)) && ((last.ypos != block.transform[5]) || (parseInt(block.transform[5]) == 634))) {
							article._.tmp.push({
								fontName: block.fontName,
								height: block.height,
								str: '',
								ypos: block.transform[5],
								xpos: block.transform[4]
							});
							// see http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/pdf_reference_1-7.pdf#page=406&zoom=auto,-307,634 and http://stackoverflow.com/questions/18354098/pdf-tm-operator
						}

						var that = article._.tmp[article._.tmp.length - 1];

						that.str += ' ' + block.str.trim();

					}

					//console.log(article._.tmp);

					if (article._.tmp.length < 5) {
						console.log('not enough text content');
					}

					var b = 1;
					var author = article._.tmp[3].str || '';
					var pageNr = article._.tmp[2].str;
					var title = '';

					if (!pageNr || !/^[A-Z\W]*$/g.test(author)) {
						var b = 0;
						author = article._.tmp[2].str || '';
						pageNr = article._.tmp[1].str;
						console.log('alter');
					}


					for (var y = 3 + b; y < article._.tmp.length - 1; y++) {
						title += article._.tmp[y].str;
					}

					console.log(title, author, pageNr);

					article.title 	= editables.text(title.trim());
					article.author 	= editables.authorlist(caseCorrection(author).split("–"));
					article.pages 	= editables.page(pageNr, pageIdx - 1, {offset: pageIdx - parseInt(pageNr)});
					article.pages.value.endpage = parseInt(pageNr) + pdf.pdfInfo.numPages - pageIdx;
					article.pages.resetDesc();

					article.order	= editables.number((journal.articles.length  + 1) * 10);

					//article._.tmp = [];

					documentsource.stats.analyzed += 1
				}); //getTextContent

				/* refresh */
				$rootScope.$broadcast('refreshView');

				/* thumbnail */
				documentsource.createThumbnail(page,  article._.id)


			}); // getPage
		}

		getPage(pdf, 1);
	}



	return (journalCtrl);
}])
.run(function(chiron_parted) {chiron_parted.register()})
