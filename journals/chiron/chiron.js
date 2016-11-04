// service wich works with the chiron pdfs

angular
.module('module.chiron', [])
.factory("chiron", ['$log', 'editables', function($log, editables) {

	var chiron = function() {
		var self = this;
	};
	
	/* necessary for importer */
	chiron.title = 'Chiron';
	chiron.template = 'journals/chiron/chiron.html'
	chiron.settings = {};
	
	/* internals */
	chiron.foundToc = 0; // how many table of contents pages
	chiron.offset = 0; // the offset between printed page numbers and PDF page numbers
	chiron.totalPages = 0; // number fo pages in total
	chiron.analyzedToc = 0;
	chiron.pageNumbers = []; // list of numbers  (printed numbers; not pdf page numbers; where articles starts)
	chiron.foundArticles = 0;	
	chiron.creatingThumbsMsg = null;
	chiron.createdThumbnails = 0;
	chiron.dateForAll = 'a date --';
	chiron.articles  = {};
	chiron.selectedThumb = -1;
	chiron.isReady = false;
	chiron.state = 0;
	chiron.states = [
	     "Start",
         "Searching and analyzing table of content",
         "Creating thumbnails",
         "Manually Edit"
    ];
	
	chiron.init = function()  {
		/* necessary for OJS */
		chiron.journal.identification = 'vol_year';
		chiron.journal.ojs_journal_code = 'chiron';
		chiron.journal.journal_code = 'chiron';		
	}
	
	
	chiron.start = function() {
		
		chiron.dateForAll = editables.text('A date', true);
		
		chiron.message('Start parsing');
		
		// find table of contents
		
		var pdf = chiron.PDF.object;		
		var total = chiron.totalPages = pdf.numPages;

		chiron.message('pdf has ' + total + ' pages');
		chiron.message("searching for >>INHALTSVERZEICHNIS<< or >>Inhalt<<");
		
		var contentPageHeadline = ['INHALTSVERZEICHNIS', 'Inhalt', 'Inhaltsverzeichnis'];
		
		
		// search in the first 10 pages
		for (i = 1; i <= 10; i++){
			pdf.getPage(i).then(function(page) {
				var n = page.pageNumber;
				page.getTextContent().then(function(textContent) {
					for(var k = 0; k < Math.max(3, textContent.items.length); k++) {
						var block = textContent.items[k];
						
						//console.log(k, block.str.trim(), contentPageHeadline.indexOf(block.str.trim()));
						
						if (contentPageHeadline.indexOf(block.str.trim()) >= 0) {
							chiron.message("found >>" + block.str.trim() + "<< on page " + n);
							chiron.state = 1;
							chiron.foundToc++;
							chiron.offset = Math.max(n, chiron.offset);
							chiron.analyzeToc(page);
							return chiron.refresh();
						}
						
						
					}
					// empty pages after Toc
					if (chiron.foundToc > 0 && textContent.items.length == 0) {
						chiron.offset = Math.max(n, chiron.offset);
						return chiron.refresh();
					}
					
				}); //getTextContent
			}); // getPage
		}	
		//ready?
		
	}
		  
	chiron.checkState = function(){
				
		chiron.foundArticles  = Object.keys(chiron.articles).length;
		
		switch (chiron.state) {
			case 1: // searching for toc pages 		
				if ((chiron.analyzedToc > 0) && (chiron.foundToc == chiron.analyzedToc)) {
					chiron.message('Analysis ready. Found ' + chiron.articles.length + ' articles.');
					chiron.state = 2;
					chiron.createThumbnails();
				}
			break;
			case 2: // creating thumbnails
				if (chiron.foundArticles == chiron.createdThumbnails) {
					chiron.message('All Thumbnails created');
					chiron.state  = 3;
					chiron.isReady = true;
					chiron.refreshPageNumbers();
				}
				
		}
		
		return true;
	}
	
	chiron.analyzeToc = function(page) {
			
		function author(string) {
			if (typeof string !== 'string') {
				return '';
			}
			return string.toLowerCase().trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}

		chiron.message("analyzing page " + page.pageNumber);
		
		page.getTextContent().then(function(textContent) {
			var lines = [];
			var line_text = '';
			var last_block = null;
			for(var k = 0; k < textContent.items.length; k++) {			
				var block = textContent.items[k];
				if((last_block != null) && (block.transform[5] != last_block.transform[5])) {
					lines.push(line_text);
					line_text = '';
				}		
				last_block = block;					
				line_text += block.str + ' ' ;
			}
			lines.push(line_text);
			
			var append = '';
			
			for (l = 1; l < lines.length; l++) {			
				var line = append + ' ' + lines[l];
				var rx = /^(([^\,]*)\,)?(.*?)(\d+)$/;
				var testLine = line.trim().replace(/\s{2,}/g, ' ');
				m = rx.exec(testLine);
				//console.log(testLine,m);
		
				if (m == null) {
					append = line;
				} else {
					append = '';
					chiron.createArticle(author(m[2]), m[3].trim(), m[4]);
					chiron.refresh();
				}
						
			}
			chiron.analyzedToc++;

		}); //getTextContent
	}
	
	chiron.createArticle = function(author, title, page, after) {
		
		author = (typeof author === 'undefined') ? '' : author;
		title = (typeof title === 'undefined') ? '' : title;
		page = (typeof page === 'undefined') ? '' : page;
		
		//$log.log(author,title,page);
		var id = Object.keys(chiron.articles).length;
		
		chiron.articles[id] = {
			"title":		editables.text(title),
			"author": 		editables.authorlist(author.split(' - ')),
			"page":			editables.page(page, page, chiron),
			"thumbnail":	''	
		};
		
		chiron.pageNumbers.push({'id': id, 'page': parseInt(page)});


	}
	
	
	chiron.createThumbnails = function() {
		chiron.message('Found offset of  ' + chiron.offset + ' pages between page number and PDF page number');
		chiron.message('Creating thumbnails');
		angular.forEach(chiron.articles, function(article, k) {
			article.thumbnail = '';
			chiron.createThumbnail(article.page.getCutAt().start, k);
		}); //each
	}
	
	chiron.createThumbnail = function(pageNr, containerId) {

		var pdf = chiron.PDF.object;
		pageNr = parseInt(pageNr);
		if ((pageNr < 1) || (pageNr > pdf.pdfInfo.numPages)) {
			chiron.message('ERROR: Page Nr ' + pageNr + ' does not exist', 'error');
			return;
		}
		
		var container = angular.element(document.querySelector('#thumbnail-container-' + containerId));
		img = container.find('img');
		chiron.articles[containerId].thumbnail = '';
		
		pdf.getPage(pageNr).then(function(page) {
			
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
		        
				chiron.articles[containerId].thumbnail = canvas.toDataURL();
				chiron.createdThumbnails += 1;
				chiron.message('Created thumbnail for page ' + pageNr);
				chiron.refresh();
	        });
		});
	}

	chiron.refreshThumb = function(i) {
		$log.log('reload ', i);
		chiron.createdThumbnails -= 1;
		chiron.message('Reload thumbail ' + i);
		chiron.articles[i].thumbnail = '';
		chiron.createThumbnail(chiron.articles[i].page.getCutAt().start, i, true);
	}

	chiron.selectThumb = function(i) {
		chiron.selectedThumb = (i == chiron.selectedThumb) ? -1 : i;
	}
	
	chiron.changeOffset = function() {
		//angular.element(document.querySelector('.thumbnail-container img')).attr('src', '');
		angular.element(document.querySelector('.thumbnail-container')).addClass('loader');
		
		chiron.createdThumbnails = 0;
		/*angular.forEach(chiron.articles, function(article) {
			article.thumbnail = ''; 
		});
		 */
		chiron.createThumbnails();
	}
	
	chiron.addArticle = function() {
		chiron.createArticle('', '', '', true);
	}
	
	chiron.removeArticle = function(i) {
		//var container = angular.element(document.querySelector('#thumbnail-' + i)).empty();
		delete chiron.articles[i];
		//$log.log(chiron.articles);
	}
	
	chiron.proceed = function() {
		var pdfPath = '/path/to/parted/pdf';
		$log.log('proceeding');
		angular.forEach(chiron.articles, function(article, k) {
			$log.log('forward article', article.title)
			chiron.forwardArticle({
				'title':			article.title,
				'abstract':			editables.text('', false),
				'author':			article.author,
				'pages':			article.page,
				'date_published':	chiron.dateForAll,
				'filepath':			pdfPath,
				'thumbnail':		article.thumbnail
			}, (k == 0));
		});
		
		$log.log('done');
		chiron.nextTab();
		
	}
	
	chiron.refreshPageNumbers = function() {
		$log.log("refresh page numbers");
		
		chiron.pageNumbers.sort(function(a,b){return a.page - b.page});
		
		angular.forEach(chiron.pageNumbers, function(v, i) {
			var end = (i + 1 < chiron.pageNumbers.length) ? chiron.pageNumbers[i + 1].page - 1 : chiron.totalPages - chiron.offset;
			var pageStr = v.page + ' - ' + end;		
			chiron.articles[v.id].page.value.endpage = end;		
		});
		
	}
	
	
	return (chiron);
	
}]);