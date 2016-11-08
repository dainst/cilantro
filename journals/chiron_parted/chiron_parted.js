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
		

		
		pdf.getPage(1).then(function(page) {			
			
			/* fetch text data */
			page.getTextContent().then(function(textContent) {
				for(var k = 0; k < Math.max(3, textContent.items.length); k++) {
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
					
					
					
					
					if (chiron.rawArticles[idx].tmp.length > 4)  {
						break;
					}
					
				}
				
				/*
				 * 			"title":		editables.text(title),
							"author": 		editables.authorlist(author.split('-')),
							"page":			editables.page(page, page, chiron),
				 */
				
				var title = (typeof chiron.rawArticles[idx].tmp[1] !== "undefined") ? chiron.rawArticles[idx].tmp[1].str : '';
				var author = (typeof chiron.rawArticles[idx].tmp[3] !== "undefined") ? chiron.rawArticles[idx].tmp[3].str : '';
				var page = (typeof chiron.rawArticles[idx].tmp[2] !== "undefined") ? chiron.rawArticles[idx].tmp[2].str : '';
				
				chiron.rawArticles[idx].title 	= editables.text(title);
				chiron.rawArticles[idx].author 	= editables.authorlist(chiron.caseCorrection(author).split('-'));
				chiron.rawArticles[idx].page 	= editables.page(page, 0, {offset: 1 - parseInt(page)});						
				chiron.rawArticles[idx].page.value.endpage = parseInt(page) + pdf.pdfInfo.numPages - 1;
				chiron.rawArticles[idx].page.resetDesc();
				
				chiron.rawArticles[idx].tmp = [];
				
				chiron.refresh();
				
				chiron.stats.analyzed += 1;
				
				
			}); //getTextContent
			
			/* thumbnail */
			chiron.createThumbnail(page,  idx)
			
			
		}); // getPage
		
		
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