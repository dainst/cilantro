/**
 * this will be the successor of journalmaster and stuff
 * it will have analyzer (protocol) (may be journal specific)
 * it will also have a datasource : folder or pdf


*/
angular

.module('controller.view_overview', [])

.controller('view_overview', ['$scope', '$log', 'settings', 'webservice', 'editables', 'messenger',
	function($scope, $log, settings, webservice, editables, messenger) {

		messenger.content.stats = $scope.documentSource.stats;

		$scope.rawArticles = [];
		$scope.thumbnails = {};

		$scope.columns = {
			order: {
				title: '#',
				tooltip: 'order',
				style: {minWidth: '50px', minWidth: '80px'},
				checked: false
			},
			author: {
				title: 'Author',
				style: {minWidth: '400px'},
				checked: false
			},
			title: {
				title: 'Title',
				style: {minWidth: '400px'},
				checked: false
			},
			page: {
				title: 'Pages',
				style: {minWidth: '200px'},
				checked: false
			},
			abstract: {
				title: 'Abstract',
				style: {minWidth: '400px'},
				checked: false
			},
			date_published: {
				title: 'Date',
				style: {minWidth: '150px'},
				checked: false
			},
			auto_publish:  {
				tooltip: 'auto publish?',
				title: '#',
				style: {minWidth: '10px'},
				checked: false
			},
			filepath: {
				title: 'filepath',
				style: {minWidth: '150px'},
				checked: false
			},
			attached: {
				title: 'attached',
				style: {minWidth: '400px'},
				checked: false
			},
			createFrontpage: {
				tooltip: 'create Frontpage?',
				title: '#',
				style: {minWidth: '10px'},
				checked: false
			},
			zenonId: {
				title: 'ZenonId',
				style: {minWidth: '150px'},
				checked: false
			}
		}



		/* proceed */

		/**
		 * initialization of overview view
		 * needs main controller to have set properly documentSource and protocol
		 */
		$scope.init = function() {

			console.log("Init View: Overview", $scope.protocol);

			// adjust view
			angular.forEach($scope.protocol.columns, function(col) {
				$scope.columns[col].checked = true;
			})

			// get document(s)
			$scope.documentSource.getDocuments($scope.journal.data.importFilePath);
		}

		$scope.$on('gotAll', function onGotAll($event) {
			console.log($scope.documentSource.stats);
		});

		$scope.$on('gotFile', function onGotFile($event, idx) {
			$scope.documentSource.stats.loaded += 1;

			var pdf = $scope.documentSource.files[idx].pdf;

			var articles = new $scope.Article();
			articles._ = { // special data for raw articles
				url: $scope.documentSource.files[idx].url,
				filename: $scope.documentSource.files[idx].filename,
				tmp: [
					{
						fontName: '',
						height: '',
						str: '',
						ypos: 0
					}
				],
				id: idx,
				deleted: false
			}

			$scope.rawArticles.push(articles);

			function getPage(pdf, pageIdx) {
				$log.log('get page' + pageIdx);
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

							var last = $scope.rawArticles[idx]._.tmp[$scope.rawArticles[idx]._.tmp.length - 1];

							if (($scope.rawArticles[idx]._.tmp.length > 10) || ((Math.round(block.height) == 10 || Math.round(block.height + 0.2) == 7) && ($scope.rawArticles[idx]._.tmp.length > 5))) {
								break;
							}

							//$scope.rawArticles[idx].raw += block.height + '\t|\t' + block.fontName + '\t|\t' + block.str + "\n";

							if (((last.fontName != block.fontName) || (last.height != block.height)) && ((last.ypos != block.transform[5]) || (parseInt(block.transform[5]) == 634))) {
								$scope.rawArticles[idx]._.tmp.push({
									fontName: block.fontName,
									height: block.height,
									str: '',
									ypos: block.transform[5],
									xpos: block.transform[4]
								});
								// see http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/pdf/pdfs/pdf_reference_1-7.pdf#page=406&zoom=auto,-307,634 and http://stackoverflow.com/questions/18354098/pdf-tm-operator
							}

							var that = $scope.rawArticles[idx]._.tmp[$scope.rawArticles[idx]._.tmp.length - 1];

							that.str += ' ' + block.str.trim();

						}

						$log.log($scope.rawArticles[idx]._.tmp);

						if ($scope.rawArticles[idx]._.tmp.length < 5) {
							$log.log('not enough text content');
						}

						var b = 1;
						var author = $scope.rawArticles[idx]._.tmp[3].str || '';
						var pageNr = $scope.rawArticles[idx]._.tmp[2].str;
						var title = '';

						if (!pageNr || !/^[A-Z\W]*$/g.test(author)) {
							var b = 0;
							author = $scope.rawArticles[idx]._.tmp[2].str || '';
							pageNr = $scope.rawArticles[idx]._.tmp[1].str;
							console.log('alter');
						}


						for (var y = 3 + b; y < $scope.rawArticles[idx]._.tmp.length - 1; y++) {
							title += $scope.rawArticles[idx]._.tmp[y].str;
						}

						$log.log(title, author, pageNr);

						$scope.rawArticles[idx].title 	= editables.text(title.trim());
						$scope.rawArticles[idx].author 	= editables.authorlist($scope.caseCorrection(author).split("–"));
						$scope.rawArticles[idx].page 	= editables.page(pageNr, pageIdx - 1, {offset: pageIdx - parseInt(pageNr)});
						$scope.rawArticles[idx].page.value.endpage = parseInt(pageNr) + pdf.pdfInfo.numPages - pageIdx;
						$scope.rawArticles[idx].page.resetDesc();

						$scope.rawArticles[idx].order	= editables.number((idx  + 1) * 10);

						//$scope.rawArticles[idx]._.tmp = [];



						$scope.documentSource.stats.analyzed += 1;
						$scope.$apply();


					}); //getTextContent


					/* thumbnail */
					$scope.createThumbnail(page,  idx)


				}); // getPage
			}

			getPage(pdf, 1);


		});


		/* tools & buttons */

		$scope.continue = function() {
			// @ TODO remove rawArticles and just use articles...
			$log.log('proceeding');
			angular.forEach($scope.rawArticles, function(article, k) {
				if (article._.deleted === true) {
					return;
				}
				if (typeof article._ !== "undefined") {
					article._ = {};
				}

				$scope.articles.push(article)
			});

			$log.log('done');
			$scope.steps.change('articles');
		}



		// open file externally
		$scope.openDocument = function(url) {
			$log.log("OPEN " + url);
			window.open(settings.rep_url + '/' + url);
		}

		$scope.selectedToMerge = false;

		$scope.mergeArticle = function(article) {

			if ($scope.selectedToMerge && ($scope.selectedToMerge._.id == article._.id)) {
				messenger.ok();
				$scope.selectedToMerge = false;
				return;
			}

			if (!$scope.selectedToMerge)  {
				messenger.alert('Select article to attach »' + article.title.value.value + '« to',1);
				$scope.selectedToMerge = article;
			} else {
				var article2 = article;
				article = $scope.selectedToMerge;
				if (confirm('Really attach article »' + article2.title.value.value + '« to »' + article.title.value.value + "« ?!")) {
					mergeArticles(article, article2);
				} else {
					$scope.mergeArticle(false);
				}
			}

		}
		
		$scope.createThumbnail = function(page, containerId) {
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

				$scope.thumbnails[containerId] = canvas.toDataURL();

				$scope.documentSource.stats.thumbnails += 1;

				$scope.$apply();

			});

		}

		$scope.selectThumb = function(i) {
			$scope.selectedThumb = (i == $scope.selectedThumb) ? -1 : i;
		}

		$scope.selectedThumb = -1;

		$scope.caseCorrection = function(string) {
			return string.toLowerCase().trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}

		function mergeArticles(main, attach)  {

			$log.log('merge!', main, attach);
			$scope.selectedToMerge = false;


			//angular.extend(main.attached.value.value, attach.attached.value.value);

			main.attached.push({
				file: attach.filepath
			});// we could add from and to, but we use the whole file anyway!

			$scope.removeArticle(attach);

			messenger.alert('Articles Merged!')
			$scope.selectedToMerge = false;
		}

		$scope.cleanArticles = function() {
			$scope.rawArticles = $scope.rawArticles.filter(function(a) {
				return !a._.deleted;
			})
			$log.log($scope.rawArticles);
		}


		$scope.removeArticle = function(article) {
			article._.deleted = true;
			$scope.cleanArticles();
			$scope.updateOrder('order', false);
		}

		$scope.updateOrder = function(order, asc, article) {

			if (!order || (order == '')) {
				return $log.log('no order given');
			}

			asc = ((typeof asc !== "undefined") && asc) ? 1 : -1;

			function orderArticles(obj, order_by, asc) {

				obj.sort(function(a, b) {
					//$log.log('ORDER BY ' + order_by + '(asc=' + asc + ')');
					if (typeof a[order_by] === "object") {
						return asc * a[order_by].compare(b[order_by]);
					}

					return (asc * a[order_by].localeCompare(b[order_by]));
				});

				angular.forEach(obj, function(a, i) {
					a.order.value.value = (i + 1)  * 10;
				})

				return obj;
			}

			if (order == 'up') {
				$log.log ('up');
				article.order.value.value -= 15;
				order = 'order';
				asc = 1;
			}

			if (order == 'down') {
				$log.log ('down');
				article.order.value.value += 15;
				order = 'order';
				asc = 1;
			}

			//$log.log('order by ' + order + ' | ' + asc);

			$scope.rawArticles = orderArticles($scope.rawArticles, order, asc);
		}




	}
]);
