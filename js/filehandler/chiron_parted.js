/**
 * this file is just kept as an example for highly specialized file handler
 * although it's not sure, that it will be used ever again or is still working at all
 */

angular
.module('module.fileHandlers.chironParted', [])
.factory("chironParted", ['$rootScope', 'editables', 'fileManager', 'pdfFileManager', 'dataset',
    function($rootScope, editables, fileManager, pdfFileManager, dataset) {

    const chironPartedHandler = new fileManager.FileHandler('chiron_parted');

    chironPartedHandler.description = "Specialized File handler for Chiron Documents (not supported currently)";
    chironPartedHandler.fileTypes = ["pdf"];

    chironPartedHandler.handleFile = file => pdfFileManager.loadFiles(file).then(files => files.forEach(file2Articles));

    chironPartedHandler.createThumbnail = pdfFileManager.createThumbnail;

    function file2Articles(fileO) {

        const file = fileManager.loadedFiles[fileO.path];

        const pdf = pdfFileManager.files[fileName].pdf;

        const article = new dataset.Subobject();
         // special data for raw articles
        article.filepath.value.value =  pdfFileManager.files[fileName].url;
        article._.tmp = [
            {
                fontName: '',
                height: '',
                str: '',
                ypos: 0
            }
        ];

        dataset.subobjects.push(article);


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

                    fileManager.loadedFiles[fileName].pagecontext.offset = - pageIdx + parseInt(pageNr);
                    article.pages.context = fileManager.loadedFiles[fileName].pagecontext;
                    article.pages.startPrint = parseInt(pageNr);
                    article.pages.endPrint = parseInt(pageNr) + pdf.pdfInfo.numPages - pageIdx;
                    //article.pages.resetDesc();

                    article.order	= editables.number((dataset.subobjects.length  + 1) * 10);

                    //article._.tmp = [];

                    fileManager.stats.analyzed += 1
                }); //getTextContent

                /* refresh */
                $rootScope.$broadcast('refreshView');

                /* thumbnail */
                pdfFileManager.createThumbnail(page,  article._.id)


            }); // getPage
        }

        getPage(pdf, 1);
    }

    chironPartedHandler.onGotAll = function() {
        chironPartedHandler.ready = true;
        messenger.info('All documents loaded')
    };

    return (chironPartedHandler);
}])
.run(function(chironParted) {chironParted.register()});
