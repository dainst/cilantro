angular
.module('module.pdf_file_manager', ['module.messenger', 'module.webservice'])
.factory('pdf_file_manager', ['$rootScope', 'settings', 'webservice', 'messenger', 'dataset', 'editables','staging_dir',
    function($rootScope, settings, webservice, messenger, dataset, editables, staging_dir) {

    const pdf_file_manager = {};

    pdf_file_manager.reset = function() {
        pdf_file_manager.dir = []; // filenames
        pdf_file_manager.files  = {}; // pdf.js documents / index: filenames
        pdf_file_manager.stats  = {
            files: 0,
            analyzed: 0,
            loaded:  0,
            thumbnails: 0
        };
        pdf_file_manager.ready = false;
    };

    pdf_file_manager.reset();

    pdf_file_manager.getStats = () => pdf_file_manager.stats;

    pdf_file_manager.isStatOk = (k, v) => (v >= pdf_file_manager.stats.files ? 1 : -1);

    const requirePdfJs = new Promise(function(resolve) {
        /**
         * @ TODO include pdf.js (& require) with npm as well and replace this stuff
         */
        require.config({paths: {'pdfjs': 'inc/pdf.js'}});
        require(['pdfjs/display/api', 'pdfjs/display/global'], function(pdfjs_api, pdfjs_global) {
            console.log('2. required pdf.js');
            pdf_file_manager.status  = 'pdf.js loaded';

            pdf_file_manager.PDF = {
                "api": pdfjs_api,
                "global": pdfjs_global,
                "data": null,
                'object': null
            };

            pdf_file_manager.PDF.global.PDFJS.workerSrc = 'js/other/pdfjs_worker_loader.js';

            resolve();
        });
    });

    const loadFilePromises = [];

    const loadFiles = function() {
        pdf_file_manager.ready = false;

        for (let fileid in pdf_file_manager.dir) {

            let url = settings.files_url + pdf_file_manager.dir[fileid].path;

            let promise = new Promise(
                function documentPromiseResolve(resolve, fail) {

                    pdf_file_manager.PDF.api.getDocument(url).then(
                        function onGotDocument(pdf) {
                            let fileInfo = {
                                pdf: pdf,
                                filename: pdf_file_manager.dir[fileid].name,
                                url: this.url,
                                pagecontext: new editables.types.Pagecontext({maximum: pdf.pdfInfo.numPages, path: this.url})
                            };

                            let promise1 = pdf.getMetadata().then(function (meta) {
                                console.log(meta);
                                this.meta = meta.info
                            }.bind(fileInfo));
                            let promise2 = pdf.getDownloadInfo().then(function (dil) {
                                function fileSize(b) {
                                    let u = 0, s = 1024;
                                    while (b >= s || -b >= s) {
                                        b /= s;//
                                        u++;
                                    }
                                    return (u ? b.toFixed(1) + ' ' : b) + ' KMGTPEZY'[u] + 'B';
                                }

                                this.size = fileSize(dil.length);
                            }.bind(fileInfo));

                            pdf_file_manager.files[this.url] = fileInfo;

                            let metadataLoaded = function () {
                                dataset.loadedFiles[this.url] = {
                                    size: this.size,
                                    url: this.url,
                                    pagecontext: this.pagecontext
                                };
                                messenger.success('document nr ' + Object.keys(pdf_file_manager.files).length + ' loaded');
                                pdf_file_manager.stats.loaded += 1;
                                refreshView();
                                resolve();
                            }.bind(fileInfo);


                            Promise.all([promise1, promise2]).then(metadataLoaded, metadataLoaded);
                            // if metadata could not be loaded, it's no reason not to continue... but we should at least try it


                        }.bind(
                            {
                                filename: pdf_file_manager.dir[fileid].name,
                                url: pdf_file_manager.dir[fileid].path
                            }
                        ),

                        function onFailDocument(reason) {
                            messenger.warning("get document " + url + " failed: " + reason, true);
                            resolve(); //!
                        }
                    )
                }
            );


            loadFilePromises.push(promise);
            //console.log('promises collected: ' + loadFilePromises.length);

        }

    };

    pdf_file_manager.getDocuments = function(path) {
        console.log("Load File: ", path);

        if (!path || path === "") {
            return;
        }

        pdf_file_manager.ready = false;

        let filesObject = staging_dir.getFileInfo(path);

        if (filesObject.type === 'directory') {
            messenger.info('loading directory contents: ' + path);
            pdf_file_manager.dir = staging_dir.list[path].contents;
            pdf_file_manager.stats.files = pdf_file_manager.dir.length;
        } else {
            pdf_file_manager.dir = [filesObject];
            pdf_file_manager.stats.files = 1;
        }

        return new Promise((resolve, reject) => {
            requirePdfJs.then(function() {
                messenger.info('ready for loading files');
                loadFiles();
                Promise.all(loadFilePromises).then(function() {
                    messenger.success("All Files loaded");
                    pdf_file_manager.ready = true;
                    refreshView();
                    resolve();
                }).catch(reject);
            });
        });

    };

    /**
     *
     * @param article
     * @returns {*}
     */
    pdf_file_manager.getFileInfo = function(article) {

        if (article.filepath.value.value === 'none') {
            return {}
        }
        let file = pdf_file_manager.files[article.filepath.value.value];
        if (angular.isUndefined(file)) {
            return {'alert': 'file not known'}
        }

        return {
            'pages': file.pagecontext.maximum,
            'page offset': file.pagecontext.offset,
            'size': file.size
        }

    };

    pdf_file_manager.isLoaded = (filePath) => angular.isDefined(pdf_file_manager.files[filePath]);

    /**
     * trigger trumbnail recreation (on page or filepath change)
     */
    $rootScope.$on('thumbnaildataChanged', function($event, article) {
        if (article.pages.value.startPdf === 0) { // while creation
            return;
        }
        if (!angular.isUndefined(pdf_file_manager.files[article.filepath.value.value])) {
            article.pages.context = pdf_file_manager.files[article.filepath.value.value].pagecontext;
            pdf_file_manager.updateThumbnail(article);
        } else {
            article.pages.resetContext();
            pdf_file_manager.removeThumbnail(article._.id);
        }
    });


    /**
     * call this from a button or something ...
     * @param article
     */
    pdf_file_manager.updateThumbnail = function(article) {
        console.log("recreate thumbnail for", article._.id, article.pages.value.startPdf, article.filepath.value.value);
        pdf_file_manager.files[article.filepath.value.value].pdf.getPage(article.pages.value.startPdf).then(
            function updateThumbnailGotPageSuccess(page) {
                pdf_file_manager.createThumbnail(page, article._.id)
            },
            function updateThumbnailGotPageFail(page) {
                messenger.error("Page " + article.pages.value.startPdf + " not found");
                console.log('page not found', article.pages.value.startPdf, article._.id);
                pdf_file_manager.removeThumbnail(article._.id)
            }
        );
    };


    /**
     * ... or this from inside a getPage promise
     * @param page
     * @param containerId
     */
    pdf_file_manager.createThumbnail = function(page, containerId) {
        let container = angular.element(document.querySelector('#thumbnail-container-' + containerId));
        let img = container.find('img');

        let viewport = page.getViewport(1.5); // scale 1.5
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.height = viewport.height; // 626.16 * 1.5
        canvas.width = viewport.width; // 399.84 * 1.5

        let renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        container.addClass('loader');
        img.unbind('load');
        img.on("load", function() {
            container.removeClass('loader');
        });

        page.render(renderContext).then(function(){
            console.log("thumbnail created");
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "#123456";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            dataset.thumbnails[containerId] = canvas.toDataURL();
            pdf_file_manager.stats.thumbnails = Object.keys(dataset.thumbnails).length;
            refreshView()
        });

    };

    pdf_file_manager.removeThumbnail = function(containerId) {
        console.log("thumbnail removed", containerId);
        delete dataset.thumbnails[containerId];
        pdf_file_manager.stats.thumbnails = Object.keys(dataset.thumbnails).length;
    };

    /**
     * since the pdf.js stuff is happening outside angular is is ansync we need this shit here
     *
     */
    function refreshView() {
        $rootScope.$broadcast('refreshView');
    }

    return pdf_file_manager;


}]);
