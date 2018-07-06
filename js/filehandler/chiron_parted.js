angular
.module('module.fileHandlers.chiron_parted', [])
.factory("chiron_parted", ['$rootScope', 'editables', 'file_handler_manager', 'pdf_file_manager', 'dataset',
	function($rootScope, editables, file_handler_manager, pdf_file_manager, dataset) {

	let journalCtrl = new file_handler_manager.FileHandler('chiron_parted');

	journalCtrl.description = "Specialized File handler for Chiron Documents";
	journalCtrl.fileTypes = ["pdf"];


	journalCtrl.onGotFile = function(fileName) {

		pdf_file_manager.stats.loaded += 1;

		let pdf = pdf_file_manager.files[fileName].pdf;

        let article = new dataset.Article();
		 // special data for raw articles
		article.filepath.value.value =  pdf_file_manager.files[fileName].url;
		article._.tmp = [
			{
				fontName: '',
				height: '',
				str: '',
				ypos: 0
			}
		];

		dataset.articles.push(article);


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

					for(let k = 0; k < textContent.items.length; k++) {
                        let block = textContent.items[k];

                        let last = article._.tmp[article._.tmp.length - 1];

						if ((article._.tmp.length > 10) || ((Math.round(block['height']) === 10 || Math.round(block.height + 0.2) === 7) && (article._.tmp.length > 5))) {
							break;
						}

						//article.raw += block.height + '\t|\t' + block.fontName + '\t|\t' + block.str + "\n";

						if (((last.fontName !== block.fontName) || (last.height !== block.height)) && ((last.ypos !== block.transform[5]) || (parseInt(block.transform[5]) === 634))) {
							article._.tmp.push({
								fontName: block.fontName,
								height: block.height,
								str: '',
								ypos: block.transform[5],
								xpos: block.transform[4]
							});
							// see http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/pdf_reference_1-7.pdf#page=406&zoom=auto,-307,634 and http://stackoverflow.com/questions/18354098/pdf-tm-operator
						}

                        let that = article._.tmp[article._.tmp.length - 1];

						that.str += ' ' + block.str.trim();

					}

					//console.log(article._.tmp);

					if (article._.tmp.length < 5) {
						console.log('not enough text content');
					}

                    let b = 1;
                    let author = article._.tmp[3].str || '';
                    let pageNr = article._.tmp[2].str;
                    let title = '';

					if (!pageNr || !/^[A-Z\W]*$/g.test(author)) {
                        let b = 0;
						author = article._.tmp[2].str || '';
						pageNr = article._.tmp[1].str;
						console.log('alter');
					}


					for (let y = 3 + b; y < article._.tmp.length - 1; y++) {
						title += article._.tmp[y].str;
					}

					console.log(title, author, pageNr);

					article.title 	= editables.text(title.trim());
					article.author 	= editables.authorlist(caseCorrection(author).split("–"));

					pdf_file_manager.files[fileName].pagecontext.offset = - pageIdx + parseInt(pageNr);
					article.pages.context = pdf_file_manager.files[fileName].pagecontext;
					article.pages.startPrint = parseInt(pageNr);
					article.pages.endPrint = parseInt(pageNr) + pdf.pdfInfo.numPages - pageIdx;
					//article.pages.resetDesc();

					article.order	= editables.number((dataset.articles.length  + 1) * 10);

					//article._.tmp = [];

					pdf_file_manager.stats.analyzed += 1
				}); //getTextContent

				/* refresh */
				$rootScope.$broadcast('refreshView');

				/* thumbnail */
				pdf_file_manager.createThumbnail(page,  article._.id)


			}); // getPage
		}

		getPage(pdf, 1);
	};

	journalCtrl.onGotAll = function() {
		journalCtrl.ready = true;
		messenger.info('All documents loaded')
	};

	return (journalCtrl);
}])
.run(function(chiron_parted) {chiron_parted.register()});
