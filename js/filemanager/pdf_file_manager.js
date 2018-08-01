angular
.module('module.pdfFileManager', ['module.messenger', 'module.webservice'])
.factory('pdfFileManager', ['$rootScope', 'settings', 'webservice', 'messenger', 'dataset', 'editables', 'fileManager',
    function($rootScope, settings, webservice, messenger, dataset, editables, fileManager) {

    const pdfFileManager = {};

    const requirePdfJs = new Promise(function(resolve) {
        // include pdf.js (& require) with npm as well and replace this stuff
        require.config({paths: {'pdfjs': 'inc/pdf.js'}});
        require(['pdfjs/display/api', 'pdfjs/display/global'], function(pdfjs_api, pdfjs_global) {
            console.log('required pdf.js');
            pdfFileManager.status  = 'pdf.js loaded';

            pdfFileManager.PDF = {
                "api": pdfjs_api,
                "global": pdfjs_global,
                "data": null,
                'object': null
            };

            pdfFileManager.PDF.global.PDFJS.workerSrc = 'js/other/pdfjs_worker_loader.js';
            resolve();
        });
    });

    const loadFiles = function(filesToLoad) {
        pdfFileManager.ready = false;

        const loadFilePromises = [];

        for (let fileid in filesToLoad) {

            const reqestParams = {url: settings.files_url + filesToLoad[fileid].path};

            if (angular.isDefined(settings.server_user) && angular.isDefined(settings.server_pass)) {
                reqestParams.httpHeaders = {
                    "Authorization": "Basic " + window.btoa(settings.server_user + ":" + settings.server_pass)
                };
                reqestParams.withCredentials = true;
            }

            const promise = new Promise(
                function documentPromiseResolve(resolve, fail) {

                    pdfFileManager.PDF.api.getDocument(reqestParams).then(
                        function onGotDocument(pdf) {
                            let fileInfo = {
                                pdf: pdf,
                                filename: filesToLoad[fileid].name,
                                url: this.url,
                                pagecontext: new editables.types.Pagecontext({maximum: pdf.pdfInfo.numPages, path: this.url})
                            };

                            let promise1 = pdf.getMetadata().then(function(meta) {
                                console.log(meta);
                                this.meta = meta.info
                            }.bind(fileInfo));
                            let promise2 = pdf.getDownloadInfo().then(function(dil) {
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

                            fileManager.loadedFiles[this.url] = fileInfo;

                            const metadataLoaded = function() {
                                dataset.loadedFiles[this.url] = {
                                    size: this.size,
                                    url: this.url,
                                    pagecontext: this.pagecontext
                                };
                                messenger.info('document: ' + this.url + ' loaded');
                                fileManager.stats.loaded += 1;
                                refreshView();
                                resolve();
                            }.bind(fileInfo);


                            Promise.all([promise1, promise2]).then(metadataLoaded, metadataLoaded);
                            // if metadata could not be loaded, it's no reason not to continue, therefore we don't fail


                        }.bind(
                            {
                                filename: filesToLoad[fileid].name,
                                url: filesToLoad[fileid].path
                            }
                        ),

                        function onFailDocument(reason) {
                            messenger.warning("get document " + reqestParams.url + " failed: " + reason, true);
                            resolve(); //!
                        }
                    )
                }
            );
            loadFilePromises.push(promise);
        }
        return loadFilePromises;
    };

    pdfFileManager.loadFiles = function(file) {
        //  TODO make recursive!
        console.log("Load File: ", file);

        const filesToLoad = (file.type === 'directory') ? file.contents : [file];
        fileManager.ready = false;
        fileManager.stats.files += filesToLoad.length;

        return new Promise((resolve, reject) => {
            requirePdfJs.then(function() {
                Promise.all(loadFiles(filesToLoad)).then(function() {
                    if (filesToLoad.length > 1) {
                        messenger.success("All Files loaded");
                    }
                    fileManager.ready = true;
                    refreshView();
                    resolve(filesToLoad);
                }).catch(reject);
            });
        });

    };

    // depricated?!
    pdfFileManager.getFileInfo = function(article) {

        if (article.filepath.value.value === 'none') {
            return {}
        }
        let file = fileManager.loadedFiles[article.filepath.value.value];
        if (angular.isUndefined(file)) {
            return {'alert': 'file not known'}
        }

        return {
            'pages': file.pagecontext.maximum,
            'page offset': file.pagecontext.offset,
            'size': file.size
        }

    };

    function renderThumbnail(page) {
        return new Promise((resolve, reject) => {
            const viewport = page.getViewport(1.5); // scale 1.5
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.height = viewport.height; // 626.16 * 1.5
            canvas.width = viewport.width; // 399.84 * 1.5

            let renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            page.render(renderContext).then(function(){
                console.log("thumbnail created");
                ctx.globalCompositeOperation = "destination-over";
                ctx.fillStyle = "#123456";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                fileManager.stats.thumbnails += 1;
                resolve(canvas.toDataURL());
            });
        });
    }

    pdfFileManager.createThumbnail = params => new Promise((resolve, reject) =>
        fileManager.loadedFiles[params.filePath].pdf
            .getPage(params.pages.startPrint)
            .then(page => renderThumbnail(page)
                .then(resolve))
            .catch(reject)
        );

    /**
     * since the pdf.js stuff is happening outside angular is is ansync we need this shit here
     *
     */
    function refreshView() {
        $rootScope.$broadcast('refreshView');
    }

    return pdfFileManager;


}]);
