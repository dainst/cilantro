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
	chiron.rawArticles = {};
	

	/* init data necessary for OJS */
	chiron.init = function()  {
		chiron.journal.identification = 'vol_year';
		chiron.journal.ojs_journal_code = 'chiron';
		chiron.journal.journal_code = 'chiron_parted';
		chiron.journal.auto_publish_issue.value.value = true;
	}
	
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
		
		chiron.rawArticles[idx] = {
			title: '',
			page: '',
			author: '',
			url: chiron.files[idx].url,
			filename: chiron.files[idx].filename,
			tmp: [
			      {
					fontName: '',
					height: '',
					str: ''
			      }
			]
		};
		
		function getPage(pdf, pageIdx) {
			$log.log('get page' + pageIdx)
			pageIdx = pageIdx || 1;
			pdf.getPage(pageIdx).then(function(page) {
				
				/* fetch text data */
				page.getTextContent(pageIdx).then(function(textContent) {
					console.log(textContent.items.length);
					
					if (textContent.items.length < 3) {
						return getPage(pdf, pageIdx + 1);
					}
					
					for(var k = 0; k < textContent.items.length; k++) {
						var block = textContent.items[k];
						
						//console.log(block);
						
						//chiron.rawArticles[idx].raw += block.height + '\t|\t' + block.fontName + '\t|\t' + block.str + "\n";
						
						last = chiron.rawArticles[idx].tmp[chiron.rawArticles[idx].tmp.length - 1];
											
						if (last.fontName != block.fontName || last.height != block.height) {
							chiron.rawArticles[idx].tmp.push({
								fontName: block.fontName,
								height: block.height,
								str: ''
							});
						}
						
						chiron.rawArticles[idx].tmp[chiron.rawArticles[idx].tmp.length - 1].str += block.str;
						
						
						
						
						if (chiron.rawArticles[idx].tmp.length > 5)  {
							break;
						}
						
					}
					$log.log(chiron.rawArticles[idx].tmp);

					
					var title = (typeof chiron.rawArticles[idx].tmp[4] !== "undefined") ? chiron.rawArticles[idx].tmp[4].str : '';
					var author = (typeof chiron.rawArticles[idx].tmp[3] !== "undefined") ? chiron.rawArticles[idx].tmp[3].str : '';
					var pageNr = (typeof chiron.rawArticles[idx].tmp[2] !== "undefined") ? chiron.rawArticles[idx].tmp[2].str : '';
					
					$log.log(pageIdx, pageNr, page);
					
					chiron.rawArticles[idx].title 	= editables.text(title);
					chiron.rawArticles[idx].author 	= editables.authorlist(chiron.caseCorrection(author).split('-'));
					chiron.rawArticles[idx].page 	= editables.page(pageNr, pageIdx - 1, {offset: pageIdx - parseInt(pageNr)});						
					chiron.rawArticles[idx].page.value.endpage = parseInt(pageNr) + pdf.pdfInfo.numPages - pageIdx;
					chiron.rawArticles[idx].page.resetDesc();
					
					chiron.rawArticles[idx].tmp = [];
					
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
			$log.log('forward article', article.title)
			chiron.forwardArticle({
				'title':			article.title,
				'abstract':			editables.text('', false),
				'author':			article.author,
				'pages':			article.page,
				'date_published':	chiron.journal.year,
				'filepath':			article.url,
				'thumbnail':		article.thumbnail
			}, (k == 0));
		});
		
		$log.log('done');
		chiron.nextTab();
	}
	
	
	
	/* helper functions */
	
	chiron.createThumbnail = function(page, containerId) {
		var container = angular.element(document.querySelector('#thumbnail-container-' + containerId));
		img = container.find('img');
		chiron.rawArticles[containerId].thumbnail = '';
			
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
	        
			chiron.rawArticles[containerId].thumbnail = canvas.toDataURL();
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
	
	chiron.removeArticle = function(i) {
		//var container = angular.element(document.querySelector('#thumbnail-' + i)).empty();
		delete chiron.rawArticles[i];
		//$log.log(chiron.articles);
	}
	
	
		

	chiron.caseCorrection = function(string) {
		return string.toLowerCase().trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	
	return (chiron);
}]);