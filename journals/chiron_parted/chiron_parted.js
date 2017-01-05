// service wich works with the chiron issues wich are allready parted into articles

angular
.module('module.chiron_parted', [])
.factory("chiron_parted", ['$log', 'editables', function($log, editables) {

	var chiron = function() {
		var self = this;
	};
	
	/* necessary for importer */
	chiron.title = 'Chiron';
	chiron.template = 'journals/chiron_parted/chiron_parted.html'
	chiron.settings = {};
	
	/* data */
	chiron.files = [];
	
	/* internals */
	chiron.rawArticles = [];
	chiron.thumbnails = [];
	

	/* init data necessary for OJS */
	chiron.init = function()  {
		chiron.journal.identification = 'vol_year';
		chiron.journal.ojs_journal_code = 'chiron';
		chiron.journal.journal_code = 'chiron_parted';
		chiron.journal.auto_publish_issue.value.value = true;
		chiron.journal.default_create_frontpage = true;
	}
	
	//chiron.article_buttons = []
	
	/* reaction for all files done */
	chiron.onGotAll = function() {
		chiron.message('all files loaded!');
		chiron.isReady = true;
		chiron.refresh();
	}
	
	/* reaction of getting a file */
	chiron.onGotFile = function(idx) {
		
		chiron.stats.loaded += 1;
		
		var pdf = chiron.files[idx].pdf;
		
		chiron.rawArticles.push({
			title: '',
			page: '',
			author: '',
			url: chiron.files[idx].url,
			filename: chiron.files[idx].filename,
			tmp: [
			      {
					fontName: '',
					height: '',
					str: '',
					ypos: 0
			      }
			],
			_id: idx,
			_deleted: false
		});
		
		function getPage(pdf, pageIdx) {
			$log.log('get page' + pageIdx)
			pageIdx = pageIdx || 1;
			pdf.getPage(pageIdx).then(function(page) {
				
				/* fetch text data */
				page.getTextContent(pageIdx).then(function(textContent) {
					
					if (textContent.items.length < 3) {
						return getPage(pdf, pageIdx + 1);
					}
					
					for(var k = 0; k < textContent.items.length; k++) {
						var block = textContent.items[k];
						
						//console.log(block);
						
						var last = chiron.rawArticles[idx].tmp[chiron.rawArticles[idx].tmp.length - 1];
						
						if ((chiron.rawArticles[idx].tmp.length > 10) || ((Math.round(block.height) == 10 || Math.round(block.height + 0.2) == 7) && (chiron.rawArticles[idx].tmp.length > 5))) {
							break;
						}
						
						//chiron.rawArticles[idx].raw += block.height + '\t|\t' + block.fontName + '\t|\t' + block.str + "\n";
											
						if (((last.fontName != block.fontName) || (last.height != block.height)) && ((last.ypos != block.transform[5]) || (parseInt(block.transform[5]) == 634))) {
							chiron.rawArticles[idx].tmp.push({
								fontName: block.fontName,
								height: block.height,
								str: '',
								ypos: block.transform[5],
								xpos: block.transform[4]
							});
							// see http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/pdf_reference_1-7.pdf#page=406&zoom=auto,-307,634 and http://stackoverflow.com/questions/18354098/pdf-tm-operator
						}
						
						var that = chiron.rawArticles[idx].tmp[chiron.rawArticles[idx].tmp.length - 1];
						
						that.str += ' ' + block.str.trim();
						
					}
					
					$log.log(chiron.rawArticles[idx].tmp);
					
					if (chiron.rawArticles[idx].tmp.length < 5) {
						$log.log('not enough text content');
					}
					
					var b = 1;
					var author = chiron.rawArticles[idx].tmp[3].str || '';
					var pageNr = chiron.rawArticles[idx].tmp[2].str;
					var title = '';
					
					if (!pageNr || !/^[A-Z\W]*$/g.test(author)) {
						var b = 0;
						author = chiron.rawArticles[idx].tmp[2].str || '';
						pageNr = chiron.rawArticles[idx].tmp[1].str;
						console.log('alter');
					}
					
					
					for (var y = 3 + b; y < chiron.rawArticles[idx].tmp.length - 1; y++) {
						title += chiron.rawArticles[idx].tmp[y].str;
					}
					

					
					
					$log.log(title, author, pageNr);
					
					chiron.rawArticles[idx].title 	= editables.text(title.trim());
					chiron.rawArticles[idx].author 	= editables.authorlist(chiron.caseCorrection(author).split("–"));
					chiron.rawArticles[idx].page 	= editables.page(pageNr, pageIdx - 1, {offset: pageIdx - parseInt(pageNr)});						
					chiron.rawArticles[idx].page.value.endpage = parseInt(pageNr) + pdf.pdfInfo.numPages - pageIdx;
					chiron.rawArticles[idx].page.resetDesc();
					
					chiron.rawArticles[idx].order	= editables.number((idx  + 1) * 10);
					
					//chiron.rawArticles[idx].tmp = [];
					
					chiron.refresh();
					
					chiron.stats.analyzed += 1;
					
					
				}); //getTextContent
				
				
				/* thumbnail */
				chiron.createThumbnail(page,  idx)
				
				
			}); // getPage
		}
		
		getPage(pdf, 1);
		
		
	}
	
	

	
	/* proceed */
	
	chiron.proceed = function() {
		$log.log('proceeding');
		angular.forEach(chiron.rawArticles, function(article, k) {
			if (article._deleted === true) {
				return;
			}
			
			$log.log('forward article', article.title)
			chiron.forwardArticle({
				'title':			article.title,
				'abstract':			editables.text('', false),
				'author':			article.author,
				'pages':			article.page,
				'date_published':	chiron.journal.year,
				'filepath':			article.url,
				'thumbnail':		article.thumbnail,
				'attached':			editables.filelist(article.attached),
				'order':			article.order,
				'createFrontpage':	editables.checkbox(true)
			}, (k == 0));
		});
		
		$log.log('done');
		chiron.nextTab();
	}
	
	
	
	/* helper functions */
	
	chiron.createThumbnail = function(page, containerId) {
		var container = angular.element(document.querySelector('#thumbnail-container-' + containerId));
		img = container.find('img');
			
        var viewport = page.getViewport(1.5); // scale 1.5
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.height = viewport.height; // 626.16 * 1.5
        canvas.width = viewport.width; // 399.84 * 1.5

        var renderContext = {
        	canvasContext: ctx,
        	viewport: viewport
        };

        container.addClass('loader');
        img.unbind('load');
        img.on("load", function() {
        	container.removeClass('loader');
        });
        
        page.render(renderContext).then(function(){
	        ctx.globalCompositeOperation = "destination-over";
	        ctx.fillStyle = "#123456";
	        ctx.fillRect(0, 0, canvas.width, canvas.height);
	        
			chiron.thumbnails[containerId] = canvas.toDataURL();
			chiron.createdThumbnails += 1;
			//chiron.message('Created thumbnail for file ' + containerId);
			chiron.refresh();
			
			chiron.stats.thumbnails += 1;
			
        });

	}

	chiron.selectThumb = function(i) {
		chiron.selectedThumb = (i == chiron.selectedThumb) ? -1 : i;
	}

	chiron.selectedThumb = -1;
	
	chiron.caseCorrection = function(string) {
		return string.toLowerCase().trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	
	return (chiron);
}]);